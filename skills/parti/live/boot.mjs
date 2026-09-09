#!/usr/bin/env node
// Boot a live session: start the helper, inject the overlay into the project's
// HTML entries, and print the JSON the agent needs to drive the session.
//
//   node live/boot.mjs                  start, inject into the one obvious entry
//   node live/boot.mjs --page src/x.html  inject into exactly this file
//   node live/boot.mjs --all            inject into every entry found (rare)
//   node live/boot.mjs --cleanup        remove every injected tag (idempotent)
//
// Default is one file, not all of them. A helper that edits every HTML file in
// the repo to start a session is a worse trade than asking which page.
//
// Injection is a <script src> tag with a data-parti-live marker. It is written
// into source so the dev server serves it like any other change; cleanup removes
// exactly the marked tags and nothing else.

import fs from 'node:fs';
import path from 'node:path';
import { createServer } from './server.mjs';

const ROOT = process.cwd();
const MARKER = 'data-parti-live';
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out', 'coverage', '.parti']);

function findHtml(dir, depth = 0, found = []) {
  if (depth > 4 || found.length > 12) return found;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const e of entries) {
    if (e.name.startsWith('.') && e.name !== '.parti') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!SKIP.has(e.name)) findHtml(full, depth + 1, found);
    } else if (e.name.endsWith('.html')) {
      found.push(full);
    }
  }
  return found;
}

function cleanupFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const stripped = src.replace(new RegExp(`\\s*<script[^>]*${MARKER}[^>]*></script>`, 'g'), '');
  if (stripped === src) return false;
  fs.writeFileSync(file, stripped);
  return true;
}

function cleanup() {
  const cleaned = findHtml(ROOT).filter(cleanupFile);
  console.log(JSON.stringify({ ok: true, cleaned }));
}

function inject(file, port) {
  const src = fs.readFileSync(file, 'utf8');
  const tag = `<script ${MARKER} src="http://127.0.0.1:${port}/live.js"></script>`;

  // A tag left over from an earlier session points at a port that is now dead,
  // and a dead tag fails silently - the overlay just never appears. Always
  // rewrite it to this session's port rather than skipping the file.
  if (src.includes(MARKER)) {
    const next = src.replace(new RegExp(`<script[^>]*${MARKER}[^>]*></script>`, 'g'), tag);
    if (next !== src) fs.writeFileSync(file, next);
    return 'repointed';
  }
  if (!/<\/body>/i.test(src)) return 'no_body';
  fs.writeFileSync(file, src.replace(/<\/body>/i, `  ${tag}\n</body>`));
  return 'injected';
}

// The entry to inject: an explicit --page, else the one conventional entry if
// exactly one is obvious, else nothing - and the agent asks which.
function chooseTargets(explicit, all) {
  const found = findHtml(ROOT);
  if (explicit) {
    const file = path.resolve(ROOT, explicit);
    return { targets: fs.existsSync(file) ? [file] : [], candidates: found, missing: !fs.existsSync(file) };
  }
  if (all) return { targets: found, candidates: found };
  const conventional = found.filter((f) => {
    const rel = path.relative(ROOT, f).replace(/\\/g, '/');
    return rel === 'index.html' || rel === 'public/index.html' || rel === 'src/index.html';
  });
  return { targets: conventional.length === 1 ? conventional : [], candidates: found };
}

const argOf = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : null;
};

if (process.argv.includes('--cleanup')) {
  cleanup();
} else {
  const { server, session } = createServer(ROOT);
  server.listen(0, '127.0.0.1', () => {
    const port = server.address().port;
    const recovered = session.recover();
    const { targets, candidates, missing } = chooseTargets(
      argOf('--page'),
      process.argv.includes('--all')
    );
    const pages = targets.map((file) => ({
      file: path.relative(ROOT, file),
      result: inject(file, port),
    }));

    // A framework project with no static HTML entry still works - the agent adds
    // the tag to the root layout itself. Say so rather than failing silently.
    const snippet = `<script ${MARKER} src="http://127.0.0.1:${port}/live.js"></script>`;

    console.log(
      JSON.stringify(
        {
          ok: true,
          port,
          token: session.token,
          session: session.id,
          dir: session.journal.dir,
          recovered,
          pages,
          // Nothing injected: hand back the candidates and the tag so the agent
          // asks which page, or pastes it into a framework root layout itself.
          candidates: pages.length ? undefined : candidates.map((f) => path.relative(ROOT, f)),
          missingPage: missing || undefined,
          snippet: pages.some((p) => p.result === 'injected' || p.result === 'repointed') ? null : snippet,
        },
        null,
        2
      )
    );
  });
}
