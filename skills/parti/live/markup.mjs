// Locating elements inside source text, for wrap and accept.
//
// Not a parser. A scanner that finds where one element starts and ends in HTML,
// JSX, Vue, or Svelte source, well enough to duplicate a block and to delete the
// duplicates again. It respects quoted attribute values (an attribute may contain
// `>`), self-closing tags, and same-name nesting. It deliberately does not try to
// understand JSX expressions or templating - the agent picks the region, and this
// only has to bound it exactly.

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

// Scan one tag beginning at `<`. Returns null if this is not a tag start.
export function readTag(src, at) {
  if (src[at] !== '<') return null;
  const isClose = src[at + 1] === '/';
  const nameStart = at + (isClose ? 2 : 1);
  const nameMatch = /^[A-Za-z][\w:.-]*/.exec(src.slice(nameStart, nameStart + 80));
  if (!nameMatch) return null;
  const name = nameMatch[0];

  // Walk to the closing `>`, skipping quoted regions so `title="a > b"` and
  // `className={x > y ? a : b}` do not end the tag early.
  let i = nameStart + name.length;
  let quote = null;
  let braces = 0;
  for (; i < src.length; i++) {
    const c = src[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '{') { braces++; continue; }
    if (c === '}') { braces = Math.max(0, braces - 1); continue; }
    if (c === '>' && braces === 0) break;
  }
  if (i >= src.length) return null;

  const text = src.slice(at, i + 1);
  return {
    name,
    isClose,
    start: at,
    end: i + 1,
    text,
    selfClosing: /\/\s*>$/.test(text) || VOID_TAGS.has(name.toLowerCase()),
  };
}

// The full extent of the element whose opening tag starts at `at`, including its
// closing tag. Same-name nesting is counted, so the inner </div> of a nested pair
// does not end the outer one.
export function elementRange(src, at) {
  const open = readTag(src, at);
  if (!open || open.isClose) return null;
  if (open.selfClosing) return { start: open.start, end: open.end, tag: open };

  let depth = 1;
  let i = open.end;
  while (i < src.length) {
    const next = src.indexOf('<', i);
    if (next === -1) break;

    // Skip comments and CDATA wholesale; they can contain anything.
    if (src.startsWith('<!--', next)) {
      const close = src.indexOf('-->', next);
      i = close === -1 ? src.length : close + 3;
      continue;
    }
    const tag = readTag(src, next);
    if (!tag) { i = next + 1; continue; }
    if (tag.name.toLowerCase() === open.name.toLowerCase() && !tag.selfClosing) {
      depth += tag.isClose ? -1 : 1;
      if (depth === 0) return { start: open.start, end: tag.end, tag: open };
    }
    i = tag.end;
  }
  return null; // unbalanced; callers must treat this as a hard failure
}

// Every element carrying data-parti-variant, outermost first, in source order.
export function findVariantBlocks(src) {
  const blocks = [];
  const re = /data-parti-variant\s*=\s*["'{]?\s*["']?([A-Za-z0-9_-]+)/g;
  let m;
  while ((m = re.exec(src))) {
    // Walk back to the `<` that opens the tag this attribute belongs to.
    const open = src.lastIndexOf('<', m.index);
    if (open === -1) continue;
    // Skip if this attribute sits inside an already-collected block's opening
    // tag (it cannot) or inside a nested variant of a previous block.
    if (blocks.some((b) => open > b.start && open < b.end)) continue;
    const range = elementRange(src, open);
    if (!range) continue;
    blocks.push({ name: m[1], start: range.start, end: range.end, text: src.slice(range.start, range.end) });
  }
  return blocks;
}

// Add or replace the marker attribute on an element's opening tag.
export function withVariantAttr(elementText, name) {
  const open = readTag(elementText, 0);
  if (!open) return null;
  const cleaned = stripVariantAttr(open.text);
  const insertAt = cleaned.indexOf(open.name) + open.name.length;
  return cleaned.slice(0, insertAt) + ` data-parti-variant="${name}"` + cleaned.slice(insertAt) +
    elementText.slice(open.end);
}

export function stripVariantAttr(text) {
  return text.replace(/\s+data-parti-variant\s*=\s*(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '');
}

// Line/column helpers so callers can address regions the way a person reads a file.
export function lineToIndex(src, line) {
  if (line <= 1) return 0;
  let i = 0;
  for (let n = 1; n < line; n++) {
    const nl = src.indexOf('\n', i);
    if (nl === -1) return src.length;
    i = nl + 1;
  }
  return i;
}

export function indexToLine(src, index) {
  let line = 1;
  for (let i = 0; i < index && i < src.length; i++) if (src[i] === '\n') line++;
  return line;
}

// The indentation of the line that `index` sits on. Duplicated blocks that ignore
// this read as machine-written the moment a person opens the file.
export function indentAt(src, index) {
  const lineStart = src.lastIndexOf('\n', index - 1) + 1;
  return /^[ \t]*/.exec(src.slice(lineStart, index))[0];
}

// CRLF survives a round trip only if it is normalised going in and restored going
// out. Windows checkouts are the common case, not the edge case.
export function detectEol(src) {
  return src.includes('\r\n') ? '\r\n' : '\n';
}

export const toLf = (src) => src.replace(/\r\n/g, '\n');
export const toEol = (src, eol) => (eol === '\r\n' ? src.replace(/\n/g, '\r\n') : src);
