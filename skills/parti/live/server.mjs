#!/usr/bin/env node
// parti live helper. Serves the overlay to the user's own browser, carries events
// between that browser and the agent, and journals everything so an interrupted
// session can be resumed by reading a file rather than restoring a process.
//
// Endpoints
//   GET  /live.js          the injected overlay (browser)
//   GET  /events           SSE stream, agent -> browser (browser)
//   POST /event            browser -> agent, queued for the next /poll (browser)
//   POST /snapshot         browser -> disk, DOM + styles for one element (browser)
//   GET  /poll             long-poll, agent takes the next event (agent)
//   POST /reply            agent -> browser, resolves an in-flight event (agent)
//   GET  /status           queue + journal state, no side effects (either)
//
// Every mutation appends one JSON line to .parti/live/<session>/journal.jsonl.
// The journal is canonical; the in-memory queue is a cache of its unacked tail.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const POLL_TIMEOUT_MS = 600_000;
const MAX_BODY_BYTES = 4 * 1024 * 1024;

// ---------------------------------------------------------------- journal

class Journal {
  constructor(root, sessionId) {
    this.dir = path.join(root, '.parti', 'live', sessionId);
    fs.mkdirSync(this.dir, { recursive: true });
    this.file = path.join(this.dir, 'journal.jsonl');
  }

  append(entry) {
    const line = { ...entry, at: new Date().toISOString() };
    fs.appendFileSync(this.file, JSON.stringify(line) + '\n');
    return line;
  }

  read() {
    if (!fs.existsSync(this.file)) return [];
    return fs
      .readFileSync(this.file, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => {
        try {
          return JSON.parse(l);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  // Events that were emitted but never acknowledged, oldest first. This is what
  // makes restart recovery a read instead of a protocol.
  pending() {
    const emitted = new Map();
    for (const e of this.read()) {
      if (e.kind === 'event') emitted.set(e.event.id, e.event);
      // An aborted event is finished business. Without this, restarting the helper
      // replays work the user explicitly stopped.
      if (e.kind === 'ack' || e.kind === 'reply' || e.kind === 'abort') emitted.delete(e.id);
      if (e.kind === 'event' && (e.event.type === 'abort' || e.event.type === 'steer')) {
        // Steer and abort are about a moment that has passed; replaying them after a
        // restart would redirect work that is no longer running.
        emitted.delete(e.event.id);
      }
    }
    return [...emitted.values()];
  }
}

// ---------------------------------------------------------------- session

class Session {
  constructor(root) {
    this.root = root;
    this.id = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14) +
      '-' + crypto.randomBytes(3).toString('hex');
    this.token = crypto.randomBytes(16).toString('hex');
    this.journal = new Journal(root, this.id);
    this.queue = [];            // events waiting for the agent
    this.waiters = [];          // parked /poll responses
    this.streams = new Set();   // SSE responses to the browser
    this.inFlight = new Map();  // event id -> event, taken by the agent
    this.cancelled = new Set(); // events the user abandoned mid-flight
  }

  // Called by the browser. Queues for the agent and wakes one parked poll.
  // `urgent` puts the event at the head: a steer or an abort is about work already
  // running, and delivered in order it would arrive too late to matter.
  emit(event, { urgent = false } = {}) {
    const full = { id: crypto.randomBytes(8).toString('hex'), ...event };
    this.journal.append({ kind: 'event', event: full });
    const waiter = this.waiters.shift();
    if (waiter) {
      this.inFlight.set(full.id, full);
      this.journal.append({ kind: 'take', id: full.id });
      waiter(full);
    } else if (urgent) {
      this.queue.unshift(full);
    } else {
      this.queue.push(full);
    }
    return full;
  }

  // Mark an in-flight event abandoned. The agent may still be mid-generation; when
  // it finally replies, the reply is journalled and dropped rather than reaching a
  // browser that has moved on.
  cancel(id) {
    this.journal.append({ kind: 'abort', id });
    this.cancelled.add(id);
    this.inFlight.delete(id);
  }

  // Called by the agent. Returns the next event, or parks until one arrives.
  take(timeoutMs) {
    const next = this.queue.shift();
    if (next) {
      this.inFlight.set(next.id, next);
      this.journal.append({ kind: 'take', id: next.id });
      return Promise.resolve(next);
    }
    return new Promise((resolve) => {
      const waiter = (event) => {
        clearTimeout(timer);
        resolve(event);
      };
      const timer = setTimeout(() => {
        const i = this.waiters.indexOf(waiter);
        if (i >= 0) this.waiters.splice(i, 1);
        resolve({ type: 'timeout' });
      }, timeoutMs);
      this.waiters.push(waiter);
    });
  }

  // Called by the agent when work on an event is done. Unblocks the browser UI.
  // `progress` is the one non-terminal status: it tells the user what is happening
  // without ending the event, so the overlay can show real steps instead of a
  // spinner that means nothing. Anything else closes the event out.
  reply(id, status, message) {
    // A reply to an aborted event is recorded and not delivered. The browser has
    // already moved on; showing its result would resurrect work the user stopped.
    if (this.cancelled.has(id)) {
      this.journal.append({ kind: 'reply-dropped', id, status });
      return { dropped: true };
    }
    if (status === 'progress') {
      this.journal.append({ kind: 'progress', id, message });
      this.push({ type: 'progress', id, message });
      return;
    }
    this.journal.append({ kind: 'reply', id, status, message });
    this.inFlight.delete(id);
    this.push({ type: 'reply', id, status, message });
  }

  // Server-sent event to every attached browser.
  push(payload) {
    const frame = `data: ${JSON.stringify(payload)}\n\n`;
    for (const res of this.streams) {
      try {
        res.write(frame);
      } catch {
        this.streams.delete(res);
      }
    }
  }

  // Requeue anything the journal says was never replied to. Called on boot so a
  // helper restart does not lose the user's click.
  recover() {
    const pending = this.journal.pending();
    this.queue.push(...pending);
    return pending.length;
  }

  snapshotPath(name) {
    const dir = path.join(this.journal.dir, 'snapshots');
    fs.mkdirSync(dir, { recursive: true });
    return path.join(dir, name);
  }
}

// ---------------------------------------------------------------- annotations

const escapeXml = (s) =>
  String(s).replace(/[<>&"']/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));

// The marks, drawn to scale over a transparent viewport-sized canvas. Deliberately
// not a render of the page: parti does not rasterize the DOM, so this is the layer
// to view against a real screenshot rather than something pretending to be one.
function annotationSvg({ viewport = {}, notes = [], pageUrl = '' }) {
  const w = viewport.w || 1280;
  const h = viewport.h || 800;
  const parts = [];

  notes.forEach((note, i) => {
    if (note.kind === 'stroke' && Array.isArray(note.points)) {
      const d = note.points.map((p, j) => `${j ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
      parts.push(`<path d="${d}" fill="none" stroke="#f0a92c" stroke-width="3" stroke-linecap="round"/>`);
      if (note.box) {
        parts.push(
          `<rect x="${note.box.x}" y="${note.box.y}" width="${note.box.w}" height="${note.box.h}" ` +
          `fill="none" stroke="#f0a92c" stroke-dasharray="4 4" stroke-width="1.5" opacity="0.8"/>`
        );
      }
    }
    const [x, y] = note.at || [0, 0];
    parts.push(
      `<g transform="translate(${x} ${y})">` +
      `<circle r="11" fill="#f0a92c"/>` +
      `<text y="4" text-anchor="middle" font-family="system-ui" font-size="12" font-weight="700" fill="#241a05">${i + 1}</text>` +
      `</g>`
    );

    // The label sits on its own plate. This file is transparent and gets viewed
    // over whatever the page or a screenshot happens to be, so text tuned for one
    // backdrop disappears on the other - and an unreadable note is a lost note.
    const text = (note.text || '').slice(0, 80);
    if (text) {
      const width = Math.round(text.length * 6.6) + 14;
      // Flip to the left of the pin rather than run off the canvas. A note marked
      // near the right edge is exactly the kind that gets clipped and lost.
      const flip = x + 16 + width > w - 8;
      const plateX = flip ? Math.max(8, x - 16 - width) : x + 16;
      parts.push(
        `<rect x="${plateX}" y="${y - 9}" width="${width}" height="19" rx="4" fill="#f0a92c"/>`,
        `<text x="${plateX + 7}" y="${y + 4}" font-family="system-ui" font-size="12" fill="#241a05">` +
        `${escapeXml(text)}</text>`
      );
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<title>parti annotations${pageUrl ? ` on ${escapeXml(pageUrl)}` : ''}</title>
${parts.join('\n')}
</svg>
`;
}

// ---------------------------------------------------------------- http

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('body_too_large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      try {
        resolve(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function send(res, code, payload, headers = {}) {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  res.writeHead(code, {
    'content-type': typeof payload === 'string' ? 'application/javascript' : 'application/json',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': 'content-type,x-parti-token',
    'cache-control': 'no-store',
    ...headers,
  });
  res.end(body);
}

export function createServer(root = process.cwd()) {
  const session = new Session(root);
  // Read per request rather than once at boot: editing the overlay and reloading
  // the page is the whole dev loop for this file, and a cached copy silently
  // serves stale code that looks like a logic bug.
  const overlaySource = () => fs.readFileSync(path.join(HERE, 'overlay.js'), 'utf8');

  // The token gates agent-side endpoints only. The overlay is served to a browser
  // we cannot authenticate, so browser endpoints are origin-open by design; the
  // server binds to loopback, which is the actual boundary.
  const agentAuthed = (req) =>
    (req.headers['x-parti-token'] || new URL(req.url, 'http://x').searchParams.get('token')) ===
    session.token;

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const route = url.pathname;

    if (req.method === 'OPTIONS') return send(res, 204, {});

    try {
      if (route === '/live.js') {
        const config = JSON.stringify({ port: server.address().port, session: session.id });
        return send(res, 200, `window.__PARTI_LIVE__=${config};\n${overlaySource()}`);
      }

      if (route === '/events') {
        res.writeHead(200, {
          'content-type': 'text/event-stream',
          'cache-control': 'no-store',
          connection: 'keep-alive',
          'access-control-allow-origin': '*',
        });
        res.write(`data: ${JSON.stringify({ type: 'hello', session: session.id })}\n\n`);
        session.streams.add(res);
        const beat = setInterval(() => res.write(': ping\n\n'), 25_000);
        req.on('close', () => {
          clearInterval(beat);
          session.streams.delete(res);
        });
        return;
      }

      if (route === '/event' && req.method === 'POST') {
        const body = await readBody(req);
        if (!body.type) return send(res, 400, { ok: false, error: 'type_required' });

        // Steer and abort are about work already in flight, so they jump the queue.
        // Delivered behind the event they modify, they would arrive after the thing
        // they were meant to change had already happened.
        if (body.type === 'steer' || body.type === 'abort') {
          const event = session.emit(body, { urgent: true });
          if (body.type === 'abort' && body.pendingId) session.cancel(body.pendingId);
          return send(res, 200, { ok: true, id: event.id });
        }

        const event = session.emit(body);
        return send(res, 200, { ok: true, id: event.id });
      }

      if (route === '/annotations' && req.method === 'POST') {
        const body = await readBody(req);
        const notes = Array.isArray(body.notes) ? body.notes : [];
        if (!notes.length) return send(res, 400, { ok: false, error: 'no_notes' });
        const stamp = Date.now();
        const dir = path.join(session.journal.dir, 'annotations');
        fs.mkdirSync(dir, { recursive: true });

        const jsonPath = path.join(dir, `${stamp}.json`);
        fs.writeFileSync(jsonPath, JSON.stringify(body, null, 2));

        // A viewable companion so a person can see what was marked without
        // reconstructing coordinates by hand. It is the annotation layer, not a
        // picture of the page - open it over a screenshot of the same viewport.
        const overlayPath = path.join(dir, `${stamp}.svg`);
        fs.writeFileSync(overlayPath, annotationSvg(body));
        session.journal.append({ kind: 'annotations', file: jsonPath, count: notes.length });
        return send(res, 200, { ok: true, path: jsonPath, overlay: overlayPath, count: notes.length });
      }

      if (route === '/snapshot' && req.method === 'POST') {
        const body = await readBody(req);
        const name = `${Date.now()}-${(body.name || 'element').replace(/[^a-z0-9_-]/gi, '')}.json`;
        const file = session.snapshotPath(name);
        fs.writeFileSync(file, JSON.stringify(body, null, 2));
        session.journal.append({ kind: 'snapshot', file });
        return send(res, 200, { ok: true, path: file });
      }

      if (route === '/poll') {
        if (!agentAuthed(req)) return send(res, 401, { ok: false, error: 'bad_token' });
        const ms = Number(url.searchParams.get('timeout')) || POLL_TIMEOUT_MS;
        const event = await session.take(ms);
        return send(res, 200, event);
      }

      if (route === '/reply' && req.method === 'POST') {
        if (!agentAuthed(req)) return send(res, 401, { ok: false, error: 'bad_token' });
        const body = await readBody(req);
        if (!body.id) return send(res, 400, { ok: false, error: 'id_required' });
        const result = session.reply(body.id, body.status || 'done', body.message);
        return send(res, 200, {
          ok: true,
          ...(result && result.dropped
            ? { dropped: true, note: 'the user cancelled this request; the reply was not delivered' }
            : {}),
        });
      }

      if (route === '/status') {
        return send(res, 200, {
          ok: true,
          session: session.id,
          dir: session.journal.dir,
          queued: session.queue.length,
          inFlight: [...session.inFlight.keys()],
          browsers: session.streams.size,
          agentWaiting: session.waiters.length,
        });
      }

      return send(res, 404, { ok: false, error: 'not_found' });
    } catch (err) {
      return send(res, 500, { ok: false, error: String(err && err.message) });
    }
  });

  return { server, session };
}

// ---------------------------------------------------------------- cli

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = process.cwd();
  const { server, session } = createServer(root);
  server.listen(0, '127.0.0.1', () => {
    const recovered = session.recover();
    console.log(
      JSON.stringify({
        ok: true,
        port: server.address().port,
        token: session.token,
        session: session.id,
        dir: session.journal.dir,
        recovered,
      })
    );
  });
}
