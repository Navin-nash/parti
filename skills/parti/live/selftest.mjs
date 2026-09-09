#!/usr/bin/env node
// One runnable check for the live protocol: node live/selftest.mjs
// Fails loudly if the browser->agent->browser round trip or journal recovery breaks.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from './server.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'parti-live-'));
const { server, session } = createServer(root);
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const H = { 'content-type': 'application/json', 'x-parti-token': session.token };

// overlay is served with its config prelude
const js = await (await fetch(`${base}/live.js`)).text();
assert.match(js, /__PARTI_LIVE__/, 'overlay missing config prelude');
assert.match(js, /PARTI_LIVE_MOUNTED/, 'overlay body not served');

// agent parks first, browser event wakes it (the ordering that actually happens)
const parked = fetch(`${base}/poll?timeout=5000&token=${session.token}`).then((r) => r.json());
await new Promise((r) => setTimeout(r, 50));
const posted = await (
  await fetch(`${base}/event`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type: 'generate', action: 'bolder', count: 3 }),
  })
).json();
const event = await parked;
assert.equal(event.type, 'generate');
assert.equal(event.id, posted.id, 'agent received a different event than the browser sent');

// queued-before-poll path
await fetch(`${base}/event`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'accept', variant: 'B' }),
});
const queued = await (await fetch(`${base}/poll?timeout=2000&token=${session.token}`)).json();
assert.equal(queued.type, 'accept', 'queued event not delivered');

// unauthenticated agent endpoints are refused
assert.equal((await fetch(`${base}/poll?timeout=100&token=nope`)).status, 401);

// timeout is a normal outcome, not an error
const timedOut = await (await fetch(`${base}/poll?timeout=150&token=${session.token}`)).json();
assert.equal(timedOut.type, 'timeout');

// reply clears in-flight state
await fetch(`${base}/reply`, {
  method: 'POST',
  headers: H,
  body: JSON.stringify({ id: event.id, status: 'variants_ready', message: { lint: {} } }),
});
const status = await (await fetch(`${base}/status`)).json();
assert.equal(status.inFlight.includes(event.id), false, 'replied event still in flight');

// journal recovery: the accept was taken but never replied to, so it must come back
const pending = session.journal.pending().map((e) => e.type);
assert.deepEqual(pending, ['accept'], `expected only the unacked accept, got ${pending}`);

// steer jumps the queue: delivered in order it would arrive after the work it
// was meant to redirect had already finished
await fetch(`${base}/event`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'generate', action: 'layout' }),
});
await fetch(`${base}/event`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'steer', note: 'quieter than that' }),
});
const first = await (await fetch(`${base}/poll?timeout=2000&token=${session.token}`)).json();
assert.equal(first.type, 'steer', 'steer did not jump the queue');

// abort: the agent's later reply is journalled and NOT delivered
const doomed = await (await fetch(`${base}/event`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'generate', action: 'bolder' }),
})).json();
await fetch(`${base}/poll?timeout=2000&token=${session.token}`);
await fetch(`${base}/event`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ type: 'abort', pendingId: doomed.id }),
});
const late = await (await fetch(`${base}/reply`, {
  method: 'POST', headers: H,
  body: JSON.stringify({ id: doomed.id, status: 'variants_ready', message: {} }),
})).json();
assert.equal(late.dropped, true, 'a reply to an aborted event was delivered anyway');

// an aborted event is finished business: a restart must not replay work the user
// explicitly stopped
const afterAbort = session.journal.pending().map((e) => e.type);
assert.equal(afterAbort.includes('abort'), false, 'abort itself was queued for replay');
assert.equal(
  session.journal.pending().filter((e) => e.id === doomed.id).length,
  0,
  'an aborted event would be replayed after a restart'
);

// annotations land on disk as data plus a viewable overlay
const anno = await (await fetch(`${base}/annotations`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    pageUrl: 'http://localhost:3000/',
    viewport: { w: 1200, h: 800, dpr: 2 },
    notes: [
      { kind: 'pin', at: [120, 240], text: 'too tight <here>', target: '.card > h2' },
      { kind: 'stroke', at: [300, 400], text: 'this whole row', points: [[300, 400], [420, 402]],
        box: { x: 300, y: 400, w: 120, h: 2 }, covers: ['.row', '.row > .cell'] },
    ],
  }),
})).json();
assert.equal(anno.count, 2);
assert.ok(fs.existsSync(anno.path), 'annotation data not written');
assert.ok(fs.existsSync(anno.overlay), 'annotation overlay not written');
const svg = fs.readFileSync(anno.overlay, 'utf8');
assert.match(svg, /width="1200" height="800"/, 'overlay is not viewport-sized');
assert.match(svg, /&lt;here&gt;/, 'note text was not XML-escaped');
assert.ok(!/<here>/.test(svg), 'raw markup from a note reached the SVG');
assert.equal((svg.match(/<circle/g) || []).length, 2, 'one pin per note expected');
assert.equal((svg.match(/<path /g) || []).length, 1, 'the stroke should draw one path');

// a label near the right edge flips instead of running off the canvas
const edge = await (await fetch(`${base}/annotations`, {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    viewport: { w: 800, h: 600 },
    notes: [{ kind: 'pin', at: [780, 100], text: 'a long note pinned at the right edge' }],
  }),
})).json();
const edgeSvg = fs.readFileSync(edge.overlay, 'utf8');
const plateX = Number(/<rect x="(\d+)"/.exec(edgeSvg)[1]);
const plateW = Number(/<rect x="\d+" y="[-\d]+" width="(\d+)"/.exec(edgeSvg)[1]);
assert.ok(plateX + plateW <= 800, `label runs off the canvas: ${plateX}+${plateW} > 800`);
assert.ok(plateX < 780, 'label did not flip to the left of the pin');

// empty submissions are refused rather than writing an empty file
assert.equal(
  (await fetch(`${base}/annotations`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ notes: [] }),
  })).status,
  400
);

// snapshots land on disk
const snap = await (
  await fetch(`${base}/snapshot`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: 'header', selector: 'header.site' }),
  })
).json();
assert.ok(fs.existsSync(snap.path), 'snapshot not written');

server.close();
fs.rmSync(root, { recursive: true, force: true });
console.log('live protocol: ok');
