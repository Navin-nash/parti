#!/usr/bin/env node
// Runnable check for wrap/accept: node live/wraptest.mjs
// Aimed at what actually breaks source surgery - same-tag nesting, `>` inside
// attributes, self-closing tags, CRLF files, indentation, and undo.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { elementRange, findVariantBlocks, readTag, withVariantAttr } from './markup.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const NL = String.fromCharCode(10);
const run = (script, args) =>
  JSON.parse(execFileSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8' }));
const runFail = (script, args) => {
  try {
    execFileSync(process.execPath, [path.join(HERE, script), ...args], { encoding: 'utf8', stdio: 'pipe' });
    return null;
  } catch (err) {
    return JSON.parse(err.stdout);
  }
};

// ---------------------------------------------------------------- scanner

{
  // an attribute value containing `>` must not end the tag
  const src = '<div title="a > b" class="x">hi</div>';
  const tag = readTag(src, 0);
  assert.equal(tag.end, src.indexOf('>hi') + 1, 'quoted > ended the tag early');
  assert.equal(elementRange(src, 0).end, src.length);
}
{
  // same-tag nesting
  const src = '<div><div>inner</div></div>';
  assert.equal(elementRange(src, 0).end, src.length, 'nested div closed the outer one');
}
{
  // self-closing and void tags
  assert.equal(elementRange('<img src="a.png" />rest', 0).end, '<img src="a.png" />'.length);
  assert.equal(elementRange('<br>rest', 0).end, '<br>'.length);
}
{
  // JSX braces containing a comparison
  const src = '<Box className={a > b ? "x" : "y"}>t</Box>';
  assert.equal(elementRange(src, 0).end, src.length, 'JSX brace comparison broke the scan');
}
{
  // comments containing tags
  const src = '<div><!-- </div> --><p>x</p></div>';
  assert.equal(elementRange(src, 0).end, src.length, 'a commented close tag ended the element');
}
{
  // marker goes on the element, never a wrapper
  const marked = withVariantAttr('<div class="card">x</div>', 'A');
  assert.equal(marked, '<div data-parti-variant="A" class="card">x</div>');
  // re-marking replaces rather than stacking
  assert.equal(withVariantAttr(marked, 'B'), '<div data-parti-variant="B" class="card">x</div>');
}
{
  // a nested variant marker must not be reported as a second top-level block
  const src = '<div data-parti-variant="A"><span data-parti-variant="inner">x</span></div>';
  assert.deepEqual(findVariantBlocks(src).map((b) => b.name), ['A']);
}

// ---------------------------------------------------------------- wrap + accept

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'parti-wrap-'));
const session = path.join(root, 'session');
fs.mkdirSync(session, { recursive: true });

const page = path.join(root, 'page.html');
const ORIGINAL = [
  '<body>',
  '  <main>',
  '    <h1 class="hero" data-x="a > b">Quarterly close</h1>',
  '    <p>after</p>',
  '  </main>',
  '</body>',
  '',
].join('\n');
fs.writeFileSync(page, ORIGINAL);

const wrapped = run('wrap.mjs', ['--file', page, '--anchor', '<h1 class="hero"', '--variants', 'A,B,C', '--session', session]);
assert.equal(wrapped.ok, true);
assert.equal(wrapped.tag, 'h1');
assert.deepEqual(wrapped.variants.map((v) => v.name), ['A', 'B', 'C']);

let text = fs.readFileSync(page, 'utf8');
assert.equal((text.match(/data-parti-variant/g) || []).length, 3);
assert.ok(text.includes('    <h1 data-parti-variant="A"'), 'indentation not preserved');
assert.ok(text.includes('    <h1 data-parti-variant="B"'), 'sibling indentation not preserved');
assert.ok(text.includes('<p>after</p>'), 'siblings outside the target were disturbed');

// the reported line numbers must actually point at the right blocks
const lines = text.split('\n');
for (const v of wrapped.variants) {
  assert.ok(
    lines[v.startLine - 1].includes(`data-parti-variant="${v.name}"`),
    `reported startLine for ${v.name} does not contain it`
  );
}

// wrapping twice is refused
const twice = runFail('wrap.mjs', ['--file', page, '--anchor', '<p>after', '--variants', 'A,B', '--session', session]);
assert.equal(twice.error, 'already_wrapped');

// the agent edits B, then the user accepts it
text = text.replace(
  '<h1 data-parti-variant="B" class="hero" data-x="a > b">Quarterly close</h1>',
  '<h1 data-parti-variant="B" class="hero" data-x="a > b">Quarterly close,<br>in one pass</h1>'
);
fs.writeFileSync(page, text);

const accepted = run('accept.mjs', ['--session', session, '--variant', 'B']);
assert.equal(accepted.ok, true);
assert.deepEqual(accepted.removed.sort(), ['A', 'C']);

const after = fs.readFileSync(page, 'utf8');
assert.ok(!/data-parti-variant/.test(after), 'marker residue left in the file');
assert.ok(after.includes('in one pass'), 'the edited variant was not the one kept');
assert.equal((after.match(/<h1/g) || []).length, 1, 'more than one h1 survived');
assert.ok(after.includes('    <h1 class="hero"'), 'indentation lost on the kept block');
assert.ok(!/\n\s*\n\s*<p>after/.test(after), 'deleting siblings left a blank line behind');
assert.equal(after.split('\n').length, ORIGINAL.split('\n').length, 'line count drifted');

// undo puts the variants back
const undone = run('accept.mjs', ['--session', session, '--undo']);
assert.equal(undone.ok, true);
assert.equal((fs.readFileSync(page, 'utf8').match(/data-parti-variant/g) || []).length, 3);

// and discard restores the file exactly as it was before any of this
const discarded = run('accept.mjs', ['--session', session, '--discard']);
assert.equal(discarded.ok, true);
assert.equal(fs.readFileSync(page, 'utf8'), ORIGINAL, 'discard did not restore the original bytes');

// ---------------------------------------------------------------- JSX

// An element in expression position cannot become three siblings - that is a
// syntax error, not a style problem. It must get a fragment, and lose it again.
const comp = path.join(root, 'Hero.tsx');
const COMPONENT = [
  'export function Hero() {',
  '  return (',
  '    <h1 className="hero">Quarterly close</h1>',
  '  );',
  '}',
  '',
].join('\n');
fs.writeFileSync(comp, COMPONENT);
const s3 = path.join(root, 'session3');
fs.mkdirSync(s3, { recursive: true });

const jsxWrap = run('wrap.mjs', ['--file', comp, '--anchor', '<h1 className="hero"', '--variants', 'A,B', '--session', s3]);
assert.equal(jsxWrap.fragment, true, 'JSX expression position did not get a fragment');
const jsxText = fs.readFileSync(comp, 'utf8');
assert.ok(jsxText.includes('<>'), 'no fragment opened');
assert.ok(jsxText.includes('</>'), 'no fragment closed');
assert.equal((jsxText.match(/data-parti-variant/g) || []).length, 2);
for (const v of jsxWrap.variants) {
  assert.ok(
    jsxText.split('\n')[v.startLine - 1].includes(`data-parti-variant="${v.name}"`),
    `JSX startLine for ${v.name} is wrong`
  );
}

run('accept.mjs', ['--session', s3, '--variant', 'B']);
const jsxAfter = fs.readFileSync(comp, 'utf8');
assert.ok(!jsxAfter.includes('<>'), 'fragment left behind after accept');
assert.ok(!/data-parti-variant/.test(jsxAfter), 'marker residue in JSX file');
assert.equal(jsxAfter, COMPONENT, 'accepting the unedited variant did not restore the original shape');

// a JSX element already in sibling position needs no fragment
const list = path.join(root, 'List.tsx');
fs.writeFileSync(list, [
  'export const List = () => (',
  '  <ul>',
  '    <li className="row">one</li>',
  '    <li>two</li>',
  '  </ul>',
  ');',
  '',
].join('\n'));
const s4 = path.join(root, 'session4');
fs.mkdirSync(s4, { recursive: true });
const sibWrap = run('wrap.mjs', ['--file', list, '--anchor', '<li className="row"', '--variants', 'A,B', '--session', s4]);
assert.equal(sibWrap.fragment, false, 'added a fragment where plain siblings are legal');
assert.ok(!fs.readFileSync(list, 'utf8').includes('<>'));
run('accept.mjs', ['--session', s4, '--variant', 'A']);
assert.ok(!/data-parti-variant/.test(fs.readFileSync(list, 'utf8')));

// ---------------------------------------------------------------- manual edit

// The browser hands back textContent: whitespace collapsed, entities decoded.
// The source has neither, and the replay has to bridge that without reformatting.
const copyFile = path.join(root, 'copy.html');
const COPY = [
  '<body>',
  '  <h1 class="hero">Quarterly close,',
  '     in one&nbsp;pass</h1>',
  '  <p class="sub">Reconcile 4,182 transactions &amp; close the books.</p>',
  '  <footer><p>Reconcile 4,182 transactions &amp; close the books.</p></footer>',
  '</body>',
  '',
].join(NL);
fs.writeFileSync(copyFile, COPY);
const s5 = path.join(root, 'session5');
fs.mkdirSync(s5, { recursive: true });

// text split across lines, with a non-breaking space, matched as the DOM reports it
const edited = run('edit.mjs', [
  '--file', copyFile, '--session', s5,
  '--before', 'Quarterly close, in one pass',
  '--after', 'Close the quarter in one pass',
]);
assert.equal(edited.ok, true, 'whitespace/entity-flexible match failed');
let copyText = fs.readFileSync(copyFile, 'utf8');
assert.ok(copyText.includes('Close the quarter in one pass'), 'replacement not written');
assert.ok(copyText.includes('&amp;'), 'unrelated entities were rewritten');

// ambiguous copy must refuse, not pick one
const ambiguousEdit = runFail('edit.mjs', [
  '--file', copyFile, '--session', s5,
  '--before', 'Reconcile 4,182 transactions & close the books.',
  '--after', 'Reconcile every transaction.',
]);
assert.equal(ambiguousEdit.error, 'text_not_unique');
assert.equal(ambiguousEdit.count, 2);
assert.ok(ambiguousEdit.occurrences[0].line < ambiguousEdit.occurrences[1].line);

// scoped to one element, it is unique again
const scoped = run('edit.mjs', [
  '--file', copyFile, '--session', s5,
  '--within', '<p class="sub"',
  '--before', 'Reconcile 4,182 transactions & close the books.',
  '--after', 'Reconcile every transaction.',
]);
assert.equal(scoped.ok, true);
copyText = fs.readFileSync(copyFile, 'utf8');
assert.ok(copyText.includes('<p class="sub">Reconcile every transaction.</p>'), 'scoped edit missed');
assert.ok(copyText.includes('<footer><p>Reconcile 4,182 transactions &amp; close the books.</p></footer>'),
  'scoped edit leaked into the footer');

// missing text refuses and reports what is nearby rather than editing blind
const missingText = runFail('edit.mjs', [
  '--file', copyFile, '--session', s5,
  '--before', 'Quarterly close, in two passes', '--after', 'x',
]);
assert.equal(missingText.error, 'text_not_found');
assert.ok(Array.isArray(missingText.near));

// a no-op edit is refused before anything is written
assert.equal(runFail('edit.mjs', ['--file', copyFile, '--before', 'a', '--after', 'a']).error, 'no_change');

// undo reverses a manual edit too
run('accept.mjs', ['--session', s5, '--undo']);
assert.ok(fs.readFileSync(copyFile, 'utf8').includes('<p class="sub">Reconcile 4,182 transactions &amp; close the books.</p>'),
  'undo did not reverse the manual edit');

// ---------------------------------------------------------------- CRLF

const crlfFile = path.join(root, 'crlf.html');
const CRLF = ORIGINAL.replace(/\n/g, '\r\n');
fs.writeFileSync(crlfFile, CRLF);
const s2 = path.join(root, 'session2');
fs.mkdirSync(s2, { recursive: true });

run('wrap.mjs', ['--file', crlfFile, '--anchor', '<h1 class="hero"', '--variants', 'A,B', '--session', s2]);
const crlfWrapped = fs.readFileSync(crlfFile, 'utf8');
assert.ok(!/[^\r]\n/.test(crlfWrapped), 'wrap introduced bare LF into a CRLF file');
run('accept.mjs', ['--session', s2, '--variant', 'A']);
const crlfAfter = fs.readFileSync(crlfFile, 'utf8');
assert.ok(!/[^\r]\n/.test(crlfAfter), 'accept introduced bare LF into a CRLF file');
assert.equal(crlfAfter, CRLF, 'CRLF round trip changed the file');

// ---------------------------------------------------------------- insert mode

// The user pointed at a gap, not an element: the anchor survives untouched and the
// variants arrive empty, so "add something here" does not start as a duplicate of
// the neighbour.
const insertFile = path.join(root, 'insert.html');
const INSERT_SRC = [
  '<body>',
  '  <main>',
  '    <h1 class="hero">Quarterly close</h1>',
  '    <p>after</p>',
  '  </main>',
  '</body>',
  '',
].join(NL);
fs.writeFileSync(insertFile, INSERT_SRC);
const s6 = path.join(root, 'session6');
fs.mkdirSync(s6, { recursive: true });

const ins = run('wrap.mjs', ['--file', insertFile, '--anchor', '<h1 class="hero"',
  '--position', 'after', '--variants', 'A,B', '--session', s6]);
assert.equal(ins.mode, 'insert');
let insText = fs.readFileSync(insertFile, 'utf8');
assert.ok(insText.includes('<h1 class="hero">Quarterly close</h1>'), 'insert mode altered the anchor');
assert.equal((insText.match(/data-parti-variant/g) || []).length, 2);
assert.ok(insText.indexOf('data-parti-variant') > insText.indexOf('<h1 class="hero"'),
  'variants landed before the anchor when asked for after');
for (const v of ins.variants) {
  assert.ok(insText.split(NL)[v.startLine - 1].includes(`data-parti-variant="${v.name}"`),
    `insert startLine for ${v.name} is wrong`);
}

// the agent fills a variant, the user accepts it, the anchor is still there
insText = insText.replace('<div data-parti-variant="B"></div>',
  '<div data-parti-variant="B"><p class="sub">Due in 6 days.</p></div>');
fs.writeFileSync(insertFile, insText);
run('accept.mjs', ['--session', s6, '--variant', 'B']);
const insAfter = fs.readFileSync(insertFile, 'utf8');
assert.ok(!/data-parti-variant/.test(insAfter), 'marker residue after insert accept');
assert.ok(insAfter.includes('<h1 class="hero">Quarterly close</h1>'), 'anchor lost on accept');
assert.ok(insAfter.includes('Due in 6 days.'), 'inserted content not kept');
assert.ok(insAfter.includes('<p>after</p>'), 'sibling after the insert point was disturbed');

// before-position puts them on the other side
const s7 = path.join(root, 'session7');
fs.mkdirSync(s7, { recursive: true });
fs.writeFileSync(insertFile, INSERT_SRC);
run('wrap.mjs', ['--file', insertFile, '--anchor', '<h1 class="hero"',
  '--position', 'before', '--variants', 'A,B', '--session', s7]);
const beforeText = fs.readFileSync(insertFile, 'utf8');
assert.ok(beforeText.indexOf('data-parti-variant') < beforeText.indexOf('<h1 class="hero"'),
  'before-position variants landed after the anchor');

assert.equal(
  runFail('wrap.mjs', ['--file', insertFile, '--anchor', '<p>after', '--position', 'sideways', '--session', s7]).error,
  'already_wrapped'
);
run('accept.mjs', ['--session', s7, '--discard']);
assert.equal(
  runFail('wrap.mjs', ['--file', insertFile, '--anchor', '<p>after', '--position', 'sideways', '--session', s7]).error,
  'bad_position'
);

// ---------------------------------------------------------------- source guard

// Accepting a variant into a build artifact is silent data loss - the next build
// erases the user's chosen design and nothing reports it.
const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });
const built = path.join(distDir, 'index.html');
fs.writeFileSync(built, '<body><h1 class="hero">x</h1></body>' + NL);
const guarded = runFail('wrap.mjs', ['--file', built, '--anchor', '<h1 class="hero"', '--session', session]);
assert.equal(guarded.error, 'not_source', 'wrapped a file inside dist/');
assert.ok(/dist/.test(guarded.reason));

const generated = path.join(root, 'schema.html');
fs.writeFileSync(generated, '<!-- @generated by codegen, do not edit -->' + NL + '<body><h1 class="hero">x</h1></body>' + NL);
const guarded2 = runFail('wrap.mjs', ['--file', generated, '--anchor', '<h1 class="hero"', '--session', session]);
assert.equal(guarded2.error, 'not_source', 'wrapped a file marked generated');

const minified = path.join(root, 'app.min.html');
fs.writeFileSync(minified, '<body><h1 class="hero">x</h1></body>' + NL);
assert.equal(
  runFail('wrap.mjs', ['--file', minified, '--anchor', '<h1 class="hero"', '--session', session]).error,
  'not_source',
  'wrapped a minified artifact'
);

// ---------------------------------------------------------------- failures

const missing = runFail('wrap.mjs', ['--file', page, '--anchor', '<nope', '--session', session]);
assert.equal(missing.error, 'anchor_not_found');

const ambiguous = path.join(root, 'dupe.html');
fs.writeFileSync(ambiguous, '<body><p>x</p><p>x</p></body>\n');
assert.equal(runFail('wrap.mjs', ['--file', ambiguous, '--anchor', '<p>x</p>', '--session', session]).error, 'anchor_not_unique');

const unbalanced = path.join(root, 'bad.html');
fs.writeFileSync(unbalanced, '<body><div>never closes</body>\n');
assert.equal(runFail('wrap.mjs', ['--file', unbalanced, '--anchor', '<div>never', '--session', session]).error, 'unbalanced_element');

assert.equal(runFail('accept.mjs', ['--session', path.join(root, 'empty'), '--variant', 'A']).error, 'no_active_wrap');

fs.rmSync(root, { recursive: true, force: true });
console.log('wrap/accept: ok');
