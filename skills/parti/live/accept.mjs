#!/usr/bin/env node
// Collapse a wrapped element back to one, or put it back the way it was.
//
//   node live/accept.mjs --session <dir> --variant B    keep B, delete the rest
//   node live/accept.mjs --session <dir> --discard      restore the pre-wrap file
//   node live/accept.mjs --session <dir> --undo         reverse the last accept
//
// Accept works on the CURRENT file, finding blocks by their marker - by the time
// the user picks, the agent has edited the variants, so stored ranges are stale.
// Discard and undo are byte-for-byte restores from backups, never reconstructions.

import fs from 'node:fs';
import path from 'node:path';
import { findVariantBlocks, stripVariantAttr, detectEol, toLf, toEol } from './markup.mjs';

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const next = process.argv[i + 1];
  if (!next || next.startsWith('--')) args.set(a.slice(2), true);
  else { args.set(a.slice(2), next); i++; }
}

// Always terminates. An `out` that returns on success lets a handled branch fall
// through into the next one - undo would print its result and then run accept.
const out = (payload) => {
  console.log(JSON.stringify(payload, null, 2));
  process.exit(payload.ok ? 0 : 1);
};

const dir = args.get('session') || path.join('.parti', 'live', 'adhoc');
const manifestPath = path.join(dir, 'wrap.json');

// --- undo: reverse the last accept -----------------------------------------

if (args.get('undo')) {
  const historyPath = path.join(dir, 'history.jsonl');
  if (!fs.existsSync(historyPath)) out({ ok: false, error: 'nothing_to_undo' });
  const entries = fs.readFileSync(historyPath, 'utf8').split('\n').filter(Boolean).map(JSON.parse);
  const last = [...entries].reverse().find((e) => !e.undone);
  if (!last) out({ ok: false, error: 'nothing_to_undo' });
  if (!fs.existsSync(last.preAcceptBackup)) {
    out({ ok: false, error: 'backup_missing', backup: last.preAcceptBackup });
  }
  fs.copyFileSync(last.preAcceptBackup, last.file);
  // Mark it undone rather than dropping the line: the history is the record of
  // what happened, not a stack of what is still true.
  const rewritten = entries
    .map((e) => (e === last ? { ...e, undone: true, undoneAt: new Date().toISOString() } : e))
    .map((e) => JSON.stringify(e))
    .join('\n') + '\n';
  fs.writeFileSync(historyPath, rewritten);
  // The variants are back in the file, so the wrap is live again.
  if (last.manifest) fs.writeFileSync(manifestPath, JSON.stringify(last.manifest, null, 2));
  out({ ok: true, action: 'undo', file: last.file, restoredVariants: last.variants });
}

// --- everything else needs the manifest -------------------------------------

if (!fs.existsSync(manifestPath)) {
  out({ ok: false, error: 'no_active_wrap', looked: manifestPath });
}
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
if (!fs.existsSync(manifest.file)) out({ ok: false, error: 'file_missing', file: manifest.file });

// --- discard: restore the pre-wrap file --------------------------------------

if (args.get('discard')) {
  if (!fs.existsSync(manifest.backup)) out({ ok: false, error: 'backup_missing', backup: manifest.backup });
  fs.copyFileSync(manifest.backup, manifest.file);
  fs.rmSync(manifestPath);
  out({ ok: true, action: 'discard', file: manifest.file, restoredFrom: manifest.backup });
}

// --- accept ------------------------------------------------------------------

const chosen = args.get('variant');
if (!chosen || chosen === true) out({ ok: false, error: 'variant_required', variants: manifest.variants });

const raw = fs.readFileSync(manifest.file, 'utf8');
const eol = detectEol(raw);
const src = toLf(raw);
const blocks = findVariantBlocks(src);

if (!blocks.length) out({ ok: false, error: 'no_variants_in_file', file: manifest.file });
const keep = blocks.find((b) => b.name === chosen);
if (!keep) {
  out({ ok: false, error: 'variant_not_found', wanted: chosen, present: blocks.map((b) => b.name) });
}

// A JSX wrap added a fragment to make siblings legal. Collapsing back to one
// element makes the fragment unnecessary, and leaving it behind would be residue
// exactly like a stray marker.
let next;
if (manifest.fragment) {
  const open = src.lastIndexOf('<>', keep.start);
  const close = src.indexOf('</>', keep.end);
  if (open === -1 || close === -1) {
    out({ ok: false, error: 'fragment_missing', hint: 'the wrapper fragment was edited away; file left unchanged' });
  }
  // The block sits one level deeper than the element originally did; put it back.
  const body = stripVariantAttr(keep.text)
    .split('\n')
    .map((line, i) => (i === 0 ? line : line.replace(/^ {2}/, '')))
    .join('\n');
  next = src.slice(0, open) + body + src.slice(close + 3);
} else {

// Rebuild the file in one pass, back to front, so earlier offsets stay valid.
next = src;
for (const block of [...blocks].reverse()) {
  if (block === keep) {
    next = next.slice(0, block.start) + stripVariantAttr(block.text) + next.slice(block.end);
    continue;
  }
  // Take the separator that was inserted with the block, so removing it does not
  // leave a blank line or a run of orphaned indentation behind.
  let from = block.start;
  const lineStart = next.lastIndexOf('\n', from - 1) + 1;
  if (next.slice(lineStart, from).trim() === '') from = lineStart;
  let to = block.end;
  if (next[to] === '\n' && from === lineStart) to += 1;
  next = next.slice(0, from) + next.slice(to);
}
}

if (/data-parti-variant/.test(next)) {
  out({ ok: false, error: 'marker_residue', hint: 'a marker survived the collapse; file left unchanged' });
}

// Snapshot before writing so undo has something to restore.
const backupDir = path.join(dir, 'backups');
fs.mkdirSync(backupDir, { recursive: true });
const preAccept = path.join(backupDir, `${Date.now()}-preaccept-${path.basename(manifest.file)}`);
fs.writeFileSync(preAccept, raw);

fs.writeFileSync(manifest.file, toEol(next, eol));

fs.appendFileSync(
  path.join(dir, 'history.jsonl'),
  JSON.stringify({
    action: 'accept',
    at: new Date().toISOString(),
    file: manifest.file,
    variant: chosen,
    variants: manifest.variants,
    preAcceptBackup: path.resolve(preAccept),
    wrapBackup: manifest.backup,
    manifest,
  }) + '\n'
);
fs.rmSync(manifestPath);

out({
  ok: true,
  action: 'accept',
  file: manifest.file,
  kept: chosen,
  removed: blocks.filter((b) => b !== keep).map((b) => b.name),
  undo: 'node live/accept.mjs --session <dir> --undo',
});
