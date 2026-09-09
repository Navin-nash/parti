#!/usr/bin/env node
// Replay a manual in-page edit into source.
//
//   node live/edit.mjs --file src/Hero.tsx --before "Old words" --after "New words"
//   node live/edit.mjs --file page.html --within '<h1 class="hero"' --before "x" --after "y"
//
// The browser hands back textContent, which is never quite what the source says:
// whitespace is collapsed, entities are decoded, and a template's `{name}` shows
// as its rendered value. So this matches on a whitespace-flexible, entity-aware
// form of the text - and when a match is ambiguous or absent it REFUSES and says
// what it saw, rather than editing the wrong line and reporting success.

import fs from 'node:fs';
import path from 'node:path';
import { elementRange, indexToLine, detectEol, toLf, toEol } from './markup.mjs';

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args.set(a.slice(2), true);
  else { args.set(a.slice(2), next); i++; }
}

const out = (payload) => {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(payload.ok ? 0 : 1);
};

const file = args.get('file');
const before = args.get('before');
const after = args.get('after');
if (!file) out({ ok: false, error: 'file_required' });
if (typeof before !== 'string') out({ ok: false, error: 'before_required' });
if (typeof after !== 'string') out({ ok: false, error: 'after_required' });
if (before === after) out({ ok: false, error: 'no_change' });
if (!fs.existsSync(file)) out({ ok: false, error: 'file_not_found', file });

const raw = fs.readFileSync(file, 'utf8');
const eol = detectEol(raw);
const src = toLf(raw);

// Search only inside one element when the caller narrows it. Copy repeats across a
// page far more often than it is unique, and the overlay always knows which
// element the user was editing.
let scope = { start: 0, end: src.length };
if (args.get('within')) {
  const anchor = String(args.get('within'));
  const at = src.indexOf(anchor);
  if (at === -1) out({ ok: false, error: 'within_not_found', anchor });
  const open = src.lastIndexOf('<', at);
  const range = elementRange(src, open);
  if (!range) out({ ok: false, error: 'within_unbalanced', anchor });
  scope = range;
}
const region = src.slice(scope.start, scope.end);

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// The DOM decodes entities and collapses whitespace; source does neither. Match a
// pattern that tolerates both, so "close, in one pass" still finds
// "close,\n      in&nbsp;one pass".
const ENTITIES = { '&': '&(?:amp;)?', '<': '(?:<|&lt;)', '>': '(?:>|&gt;)', '"': '(?:"|&quot;)', "'": "(?:'|&#0?39;|&apos;)" };
function pattern(text) {
  return text
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => [...word].map((ch) => ENTITIES[ch] || escape(ch)).join(''))
    .join('(?:\\s|&nbsp;|<br\\s*/?>)+');
}

const re = new RegExp(pattern(before), 'g');
const hits = [...region.matchAll(re)];

if (!hits.length) {
  // Say what is actually there. "not found" with no context sends the caller
  // guessing at whitespace when the real problem is usually a templated value.
  const firstWord = before.trim().split(/\s+/)[0];
  const near = firstWord && firstWord.length > 2
    ? [...region.matchAll(new RegExp(escape(firstWord), 'g'))]
        .slice(0, 3)
        .map((m) => ({
          line: indexToLine(src, scope.start + m.index),
          text: region.slice(Math.max(0, m.index - 30), m.index + 70).replace(/\s+/g, ' ').trim(),
        }))
    : [];
  out({
    ok: false,
    error: 'text_not_found',
    searched: before,
    near,
    hint: near.length
      ? 'the copy near those lines may be templated or split by markup; edit it by hand'
      : 'the text is not in this file; check the element the user edited belongs here',
  });
}

const nth = args.get('nth') ? Number(args.get('nth')) : null;
if (hits.length > 1 && !nth) {
  out({
    ok: false,
    error: 'text_not_unique',
    count: hits.length,
    occurrences: hits.slice(0, 8).map((m, i) => ({
      nth: i + 1,
      line: indexToLine(src, scope.start + m.index),
    })),
    hint: 'narrow with --within "<tag ...", or pick one with --nth N; do not guess',
  });
}

const hit = hits[(nth || 1) - 1];
if (!hit) out({ ok: false, error: 'nth_out_of_range', count: hits.length });

// Replace only the matched span. The source keeps its own whitespace and entities
// everywhere else, so a copy fix does not silently reformat the file.
const at = scope.start + hit.index;
const next = src.slice(0, at) + after + src.slice(at + hit[0].length);

const dir = args.get('session') || path.join('.parti', 'live', 'adhoc');
const backupDir = path.join(dir, 'backups');
fs.mkdirSync(backupDir, { recursive: true });
const backup = path.join(backupDir, `${Date.now()}-preedit-${path.basename(file)}`);
fs.writeFileSync(backup, raw);

fs.writeFileSync(file, toEol(next, eol));

fs.appendFileSync(
  path.join(dir, 'history.jsonl'),
  JSON.stringify({
    action: 'manual_edit',
    at: new Date().toISOString(),
    file: path.resolve(file),
    line: indexToLine(src, at),
    before,
    after,
    preAcceptBackup: path.resolve(backup),
  }) + '\n'
);

out({
  ok: true,
  action: 'manual_edit',
  file,
  line: indexToLine(src, at),
  replaced: hit[0],
  with: after,
  otherOccurrences: hits.length - 1,
  undo: 'node live/accept.mjs --session <dir> --undo',
});
