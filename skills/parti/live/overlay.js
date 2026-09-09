// parti live overlay. Injected into the user's own page by boot.mjs.
//
// Register: product. This is a tool used many times per session while the real
// work is the page underneath, so it is keyboard-first, sits still, and never
// animates for its own sake. Everything lives in a shadow root: an overlay that
// restyles the thing being designed is an instrument that changes what it measures.
//
// Keyboard
//   p / alt+p     pick mode          esc      cancel, close, deselect
//   up / down     widen / narrow the selection   (the picker's real failure mode)
//   k / cmd+k     action palette     /        jump to the prompt field
//   enter         run the selected action, or accept the shown variant
//   1..9          switch variant     backspace  discard variants
//   i             insert mode        e        edit text in place
//   n             note mode: drag to mark an area, click to drop a pin
//   cmd+z         undo the last accept
(() => {
  const CFG = window.__PARTI_LIVE__;
  if (!CFG || window.__PARTI_LIVE_MOUNTED__) return;
  window.__PARTI_LIVE_MOUNTED__ = true;

  const API = `http://127.0.0.1:${CFG.port}`;
  const STORE = 'parti.live.dock';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ACTIONS = [
    ['bolder', 'amplify a bland element', 'B'],
    ['quieter', 'tone down a loud element', 'Q'],
    ['typeset', 'type scale, weight, measure', 'T'],
    ['layout', 'spacing, rhythm, hierarchy', 'L'],
    ['colorize', 'strategic color, within the spec', 'C'],
    ['animate', 'purposeful motion, rule-checked', 'A'],
    ['states', 'empty, loading, error, overflow', 'S'],
    ['density', 'tighten or loosen information', 'D'],
    ['copy', 'rewrite the words', 'W'],
    ['freeform', 'describe it in your own words', 'F'],
  ];

  const post = (route, body) =>
    fetch(`${API}${route}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).then((r) => r.json());

  // ------------------------------------------------------------ selectors

  // A selector that survives an HMR reload. Prefers an id, then a data-testid,
  // then a class-anchored nth-of-type path. Deliberately not :nth-child alone -
  // that breaks the moment a sibling is added, which is what variants do.
  function selectorFor(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return `#${CSS.escape(el.id)}`;
    const testid = el.getAttribute('data-testid');
    if (testid) return `[data-testid="${CSS.escape(testid)}"]`;

    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && node !== document.body && parts.length < 6) {
      let part = node.tagName.toLowerCase();
      const cls = [...node.classList]
        .filter((c) => !c.startsWith('parti-') && !/^(is|has)-/.test(c))
        .slice(0, 2);
      if (cls.length) part += '.' + cls.map((c) => CSS.escape(c)).join('.');
      const siblings = node.parentElement
        ? [...node.parentElement.children].filter((s) => s.tagName === node.tagName)
        : [];
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(' > ');
  }

  const label = (el) =>
    el.tagName.toLowerCase() +
    (el.id ? `#${el.id}` : '') +
    (el.classList.length ? `.${[...el.classList].filter((c) => !c.startsWith('parti-'))[0] || ''}` : '');

  function anatomyOf(el) {
    const cs = getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const keep = [
      'display', 'position', 'flexDirection', 'gridTemplateColumns', 'gap',
      'padding', 'margin', 'width', 'maxWidth', 'height',
      'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
      'color', 'backgroundColor', 'backgroundImage', 'borderRadius', 'border',
      'boxShadow', 'opacity', 'transform', 'transition', 'zIndex',
    ];
    const styles = {};
    for (const k of keep) styles[k] = cs[k];

    const ancestors = [];
    for (let n = el.parentElement; n && n !== document.body && ancestors.length < 5; n = n.parentElement) {
      ancestors.push({ selector: selectorFor(n), label: label(n) });
    }

    return {
      selector: selectorFor(el),
      tag: el.tagName.toLowerCase(),
      classes: [...el.classList].filter((c) => !c.startsWith('parti-')),
      id: el.id || null,
      text: (el.textContent || '').trim().slice(0, 240),
      rect: { x: rect.x, y: rect.y, w: rect.width, h: rect.height },
      styles,
      ancestors,
      childCount: el.children.length,
      html: el.outerHTML.slice(0, 4000),
      viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
      scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    };
  }

  // ------------------------------------------------------------ shell

  // The one rule that has to live in the page rather than the shadow root.
  // `hidden` is a UA rule (`[hidden]{display:none}`), so any author rule that sets
  // display - `.row{display:flex}` - outranks it and the "hidden" variant keeps
  // rendering. Without this, switching variants shows all of them at once on most
  // real projects. Scoped to variant blocks so it can affect nothing else.
  const pageCss = document.createElement('style');
  pageCss.setAttribute('data-parti-live-css', '');
  pageCss.textContent = '[data-parti-variant][hidden]{display:none!important}';
  document.head.appendChild(pageCss);

  const host = document.createElement('div');
  host.setAttribute('data-parti-overlay', '');
  host.style.cssText = 'position:fixed;inset:0;z-index:2147483647;pointer-events:none';
  document.documentElement.appendChild(host);
  const root = host.attachShadow({ mode: 'open' });

  root.innerHTML = `
    <style>
      :host { all: initial; }
      *, *::before, *::after { box-sizing: border-box; margin: 0; }
      :where(button, input, textarea) { font: inherit; color: inherit; }

      /* Chrome that reads as an instrument, not a second interface: one neutral
         surface, one accent, and nothing that competes with the page beneath. */
      .ui {
        --bg: #14161acc; --solid: #14161a; --line: #ffffff1f; --ink: #f2f4f7;
        --dim: #9aa2ae; --accent: #5b8cff; --warn: #f0a92c; --good: #43c07d;
        --r: 10px; --shadow: 0 10px 34px #00000059, 0 1px 0 #ffffff14 inset;
        font: 13px/1.45 ui-sans-serif, -apple-system, "Segoe UI", system-ui, sans-serif;
        color: var(--ink);
        -webkit-font-smoothing: antialiased;
      }
      @media (prefers-color-scheme: light) {
        /* The dark accent reads at 3.16:1 on white - fine as an outline, below the
           body floor as text. Darkened to 4.54:1 (hue and chroma preserved) so the
           selector label and filled buttons both pass AA. Checked with color.py. */
        .ui { --bg: #ffffffe6; --solid: #fff; --line: #10142014; --ink: #171a1f;
              --dim: #666e7a; --accent: #4270e0;
              --shadow: 0 10px 34px #10142024, 0 0 0 1px #10142010; }
      }

      /* --- selection highlight ------------------------------------------ */
      .hi { position: fixed; pointer-events: none; display: none;
            outline: 1.5px solid var(--accent); outline-offset: 0;
            background: color-mix(in oklch, var(--accent) 10%, transparent);
            border-radius: 2px; }
      .hi.locked { outline-style: solid; outline-width: 2px; }
      .pad { position: fixed; pointer-events: none; display: none;
             outline: 1px dashed color-mix(in oklch, var(--accent) 55%, transparent); }
      .meta { position: fixed; pointer-events: none; display: none;
              transform: translateY(-100%); background: var(--accent); color: #fff;
              padding: 2px 7px; border-radius: 6px 6px 6px 0; font-size: 11px;
              font-family: ui-monospace, "SF Mono", Menlo, monospace;
              white-space: nowrap; box-shadow: 0 2px 10px #0003; }
      .meta b { font-weight: 600; }
      .meta span { opacity: .75; margin-left: 6px; }

      /* --- dock ---------------------------------------------------------- */
      .dock { position: fixed; right: 18px; bottom: 18px; pointer-events: auto;
              display: flex; align-items: center;
              gap: 2px; padding: 5px; background: var(--bg); border: 1px solid var(--line);
              border-radius: 999px; box-shadow: var(--shadow);
              backdrop-filter: blur(14px) saturate(1.4); }
      .grip { width: 22px; height: 26px; cursor: grab; display: grid; place-items: center;
              color: var(--dim); }
      .grip:active { cursor: grabbing; }
      .dock button { border: 0; background: transparent; color: var(--ink); cursor: pointer;
              padding: 6px 11px; border-radius: 999px; display: flex; align-items: center; gap: 6px; }
      .dock button:hover { background: color-mix(in oklch, var(--ink) 10%, transparent); }
      .dock button:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
      .dock button[aria-pressed="true"] { background: var(--accent); color: #fff; }
      kbd { font: 500 10px/1 ui-monospace, Menlo, monospace; padding: 3px 4px; border-radius: 4px;
            background: color-mix(in oklch, var(--ink) 12%, transparent); color: var(--dim); }
      .dock button[aria-pressed="true"] kbd { background: #ffffff2e; color: #fff; }
      .sep { width: 1px; height: 18px; background: var(--line); margin: 0 3px; }
      .state { display: flex; align-items: center; gap: 7px; padding: 0 10px 0 6px;
               color: var(--dim); font-size: 12px; max-width: 34ch;
               overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }
      .led { width: 7px; height: 7px; border-radius: 50%; background: var(--good); flex: none; }
      .led[data-s="busy"] { background: var(--warn); }
      .led[data-s="down"] { background: #e5484d; }
      @media (prefers-reduced-motion: no-preference) {
        .led[data-s="busy"] { animation: pulse 1.1s ease-in-out infinite; }
      }
      @keyframes pulse { 50% { opacity: .3; } }

      /* --- breadcrumb ---------------------------------------------------- */
      .crumbs { position: fixed; pointer-events: auto; display: none; gap: 3px;
                align-items: center; padding: 4px; background: var(--bg);
                border: 1px solid var(--line); border-radius: 999px;
                box-shadow: var(--shadow); backdrop-filter: blur(14px);
                max-width: min(72vw, 720px); overflow-x: auto; scrollbar-width: none; }
      .crumbs::-webkit-scrollbar { display: none; }
      .crumbs button { border: 0; background: transparent; color: var(--dim); cursor: pointer;
                white-space: nowrap; padding: 4px 9px; border-radius: 999px;
                font-family: ui-monospace, Menlo, monospace; font-size: 11px; }
      .crumbs button:hover { background: color-mix(in oklch, var(--ink) 10%, transparent); color: var(--ink); }
      .crumbs button[aria-current="true"] { background: var(--accent); color: #fff; }
      .crumbs .caret { color: var(--dim); opacity: .5; font-size: 10px; }

      /* --- palette ------------------------------------------------------- */
      .palette { position: fixed; pointer-events: auto; display: none; width: 340px;
                 background: var(--solid); border: 1px solid var(--line); border-radius: var(--r);
                 box-shadow: var(--shadow); overflow: hidden; }
      .palette header { display: flex; align-items: center; gap: 8px; padding: 9px 11px;
                 border-bottom: 1px solid var(--line); }
      .palette header .target { font-family: ui-monospace, Menlo, monospace; font-size: 11px;
                 color: var(--accent); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .filter { width: 100%; border: 0; background: transparent; padding: 10px 12px;
                 border-bottom: 1px solid var(--line); outline: none; }
      .filter::placeholder { color: var(--dim); }
      .list { max-height: 232px; overflow-y: auto; padding: 5px;
              scrollbar-width: thin; scrollbar-color: var(--dim) transparent; }
      .list::-webkit-scrollbar { width: 8px; }
      .list::-webkit-scrollbar-thumb { background: color-mix(in oklch, var(--ink) 22%, transparent);
              border-radius: 99px; border: 2px solid transparent; background-clip: content-box; }
      .opt { display: flex; align-items: baseline; gap: 9px; width: 100%; text-align: left;
             border: 0; background: transparent; padding: 7px 8px; border-radius: 7px; cursor: pointer; }
      .opt[data-active="true"] { background: color-mix(in oklch, var(--accent) 18%, transparent); }
      .opt .name { font-weight: 550; }
      .opt .hint { color: var(--dim); font-size: 12px; overflow: hidden;
                   text-overflow: ellipsis; white-space: nowrap; }
      .opt kbd { margin-left: auto; }
      .compose { padding: 9px; border-top: 1px solid var(--line); display: grid; gap: 8px; }
      textarea { width: 100%; min-height: 54px; max-height: 40vh; resize: vertical;
                 background: color-mix(in oklch, var(--ink) 6%, transparent);
                 border: 1px solid var(--line); border-radius: 8px; padding: 8px; outline: none; }
      textarea:focus { border-color: var(--accent); }
      .compose .row { display: flex; align-items: center; gap: 8px; }
      .count { display: flex; gap: 3px; }
      .count button { border: 1px solid var(--line); background: transparent; color: var(--dim);
                 width: 27px; height: 27px; border-radius: 7px; cursor: pointer; }
      .count button[aria-pressed="true"] { border-color: var(--accent); color: var(--ink);
                 background: color-mix(in oklch, var(--accent) 18%, transparent); }
      .run { margin-left: auto; border: 0; background: var(--accent); color: #fff;
             padding: 8px 13px; border-radius: 8px; cursor: pointer; font-weight: 600;
             display: flex; align-items: center; gap: 7px; }
      .run[disabled] { opacity: .45; cursor: default; }
      .run kbd { background: #ffffff2e; color: #fff; }

      /* --- variant rail --------------------------------------------------- */
      .rail { position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
              pointer-events: auto; display: none; align-items: stretch; gap: 5px; padding: 5px;
              background: var(--bg); border: 1px solid var(--line); border-radius: 14px;
              box-shadow: var(--shadow); backdrop-filter: blur(14px); max-width: 94vw; }
      .rail .vs { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; }
      .rail .vs::-webkit-scrollbar { display: none; }
      .v { display: grid; gap: 2px; justify-items: start; border: 1px solid transparent;
           background: color-mix(in oklch, var(--ink) 8%, transparent); color: var(--ink);
           padding: 7px 11px; border-radius: 9px; cursor: pointer;
           min-width: 132px; max-width: 200px; }
      .v:hover { border-color: color-mix(in oklch, var(--accent) 50%, transparent); }
      .v[aria-pressed="true"] { background: var(--accent); color: #fff; }
      .v .top { display: flex; align-items: center; gap: 6px; font-weight: 600;
                white-space: nowrap; max-width: 100%; }
      .v .nm { overflow: hidden; text-overflow: ellipsis; }
      .v .note, .v .top { min-width: 0; }
      .v .note { font-size: 11px; opacity: .72; max-width: 100%; overflow: hidden;
                 text-overflow: ellipsis; white-space: nowrap; }
      .v .drift { color: var(--warn); font-size: 11px; font-weight: 600; margin-left: auto; }
      .v[aria-pressed="true"] .drift { color: #fff; }
      .rail .act { display: grid; gap: 4px; padding-left: 5px; margin-left: 1px;
                 border-left: 1px solid var(--line); }
      .rail .act button { border: 0; border-radius: 8px; padding: 6px 12px; cursor: pointer;
                 font-weight: 600; font-size: 12px; display: flex; align-items: center;
                 justify-content: space-between; gap: 10px; white-space: nowrap; }
      .rail .ok { background: var(--good); color: #06240f; }
      .rail .ok kbd { background: #06240f24; color: #06240f; }
      .rail .no { background: color-mix(in oklch, var(--ink) 12%, transparent); color: var(--ink); }

      /* The rail and the dock both live at the bottom edge. While variants are up,
         lift the dock over the rail - unless the user has dragged it somewhere,
         in which case their placement wins. */
      .ui[data-rail="on"] .dock:not([data-moved]) { bottom: var(--rail-lift, 84px); }

      .dock .steer { background: color-mix(in oklch, var(--accent) 22%, transparent); }
      .dock .cancel { color: var(--dim); }

      /* --- insertion caret ------------------------------------------------ */
      /* A line where the new thing will land. Insert mode without this is asking
         someone to trust that "after the card" meant the edge they had in mind. */
      .caret { position: fixed; display: none; pointer-events: none;
               background: var(--accent); border-radius: 2px;
               box-shadow: 0 0 0 3px color-mix(in oklch, var(--accent) 25%, transparent); }

      /* --- knobs ---------------------------------------------------------- */
      /* Tuning a variant beats regenerating it: the round trip to the agent is
         seconds, a slider is instant, and "a bit tighter" is not a new design. */
      .knobs { position: fixed; display: none; pointer-events: auto; width: 232px;
               background: var(--solid); border: 1px solid var(--line);
               border-radius: var(--r); box-shadow: var(--shadow); padding: 10px;
               display: none; }
      .knobs[data-open="1"] { display: grid; gap: 9px; }
      .knobs h5 { margin: 0; font-size: 11px; letter-spacing: .08em; color: var(--dim);
               text-transform: uppercase; font-weight: 600; }
      .knob { display: grid; gap: 4px; }
      .knob .top { display: flex; justify-content: space-between; align-items: baseline; }
      .knob .val { color: var(--dim); font-family: ui-monospace, Menlo, monospace; font-size: 11px; }
      .knob input[type="range"] { width: 100%; accent-color: var(--accent); }
      .knob select, .knob input[type="checkbox"] { accent-color: var(--accent); }
      .knob select { background: color-mix(in oklch, var(--ink) 6%, transparent);
               border: 1px solid var(--line); border-radius: 6px; padding: 5px; }

      /* --- annotations ----------------------------------------------------- */
      /* Pointing at the thing and saying what is wrong is the oldest and clearest
         design review there is. Every mark is anchored to an element, so the note
         survives a reload and lands somewhere the agent can actually act. */
      .ink { position: fixed; inset: 0; display: none; pointer-events: none;
             width: 100%; height: 100%; }
      .ui[data-note="on"] .ink { display: block; pointer-events: auto;
             cursor: crosshair; }
      .ink path { fill: none; stroke: var(--warn); stroke-width: 3;
             stroke-linecap: round; stroke-linejoin: round; }
      .ink rect.zone { fill: none; stroke: var(--warn); stroke-dasharray: 4 4;
             stroke-width: 1.5; opacity: .8; }

      .notes { position: fixed; display: none; pointer-events: auto; width: 268px;
             right: 18px; top: 18px; background: var(--solid); color: var(--ink);
             border: 1px solid var(--line); border-radius: var(--r);
             box-shadow: var(--shadow); padding: 10px; }
      .notes[data-open="1"] { display: grid; gap: 8px; }
      .notes h5 { margin: 0; font-size: 11px; letter-spacing: .08em; color: var(--dim);
             text-transform: uppercase; font-weight: 600; }
      .note-row { display: flex; gap: 8px; align-items: flex-start; }
      .note-row .n { flex: none; width: 18px; height: 18px; border-radius: 50%;
             background: var(--warn); color: #241a05; font-size: 11px; font-weight: 700;
             display: grid; place-items: center; }
      .note-row .what { font-size: 12px; }
      .note-row .what small { display: block; color: var(--dim);
             font-family: ui-monospace, Menlo, monospace; }
      .note-row button { margin-left: auto; border: 0; background: transparent;
             color: var(--dim); cursor: pointer; }
      .notes .hint { color: var(--dim); font-size: 11px; }

      .pin { position: fixed; pointer-events: auto; width: 20px; height: 20px;
             border-radius: 50% 50% 50% 2px; background: var(--warn); color: #241a05;
             font-size: 11px; font-weight: 700; display: grid; place-items: center;
             transform: translate(-2px, -20px); box-shadow: 0 2px 8px #0004; }

      /* --- toasts --------------------------------------------------------- */
      .toasts { position: fixed; bottom: 18px; left: 18px; display: grid; gap: 6px;
                pointer-events: none; max-width: 46ch; }
      .toast { pointer-events: auto; background: var(--solid); border: 1px solid var(--line);
               border-left: 3px solid var(--accent); border-radius: 8px; padding: 9px 11px;
               box-shadow: var(--shadow); }
      .toast[data-kind="error"] { border-left-color: #e5484d; }
      .toast[data-kind="warn"] { border-left-color: var(--warn); }
      .toast .t { font-weight: 600; margin-bottom: 2px; }
      .toast .d { color: var(--dim); font-size: 12px; }
      @media (prefers-reduced-motion: no-preference) {
        .toast { animation: rise .12s ease-out; }
      }
      @keyframes rise { from { opacity: 0; transform: translateY(4px); } }
      [hidden] { display: none !important; }
    </style>

    <div class="ui">
      <div class="hi"></div><div class="pad"></div><div class="meta"></div>

      <div class="crumbs" role="toolbar" aria-label="element ancestry"></div>

      <div class="dock" role="toolbar" aria-label="parti live">
        <span class="grip" title="drag to move">⠿</span>
        <button data-act="pick" aria-pressed="false" title="pick an element">Pick <kbd>P</kbd></button>
        <button data-act="insert" aria-pressed="false" title="add something new at a position">Insert <kbd>I</kbd></button>
        <button data-act="palette" title="action palette">Actions <kbd>K</kbd></button>
        <button data-act="edit" title="edit text in place">Text <kbd>E</kbd></button>
        <button data-act="note" aria-pressed="false" title="point at it and say what is wrong">Note <kbd>N</kbd></button>
        <button data-act="narrow" title="open this page at phone width in a real window">Narrow</button>
        <span class="sep"></span>
        <span class="state"><span class="led" data-s="idle"></span><span class="msg">ready</span></span>
        <button class="steer" data-act="steer" hidden title="redirect the work in flight">Steer</button>
        <button class="cancel" data-act="abort" hidden title="stop this request">Cancel</button>
        <button data-act="exit" title="end the live session">Exit</button>
      </div>

      <div class="palette" role="dialog" aria-label="design action">
        <header><span class="target"></span></header>
        <input class="filter" placeholder="Filter actions" aria-label="filter actions" />
        <div class="list" role="listbox"></div>
        <div class="compose">
          <textarea placeholder="Optional: what should change, in your words" aria-label="prompt"></textarea>
          <div class="row">
            <span class="count" role="group" aria-label="how many variants"></span>
            <button class="run" disabled>Generate <kbd>↵</kbd></button>
          </div>
        </div>
      </div>

      <div class="rail" role="toolbar" aria-label="variants"></div>
      <div class="knobs" role="group" aria-label="tune this variant"></div>
      <div class="caret" aria-hidden="true"></div>
      <svg class="ink" aria-hidden="true"></svg>
      <div class="notes" role="group" aria-label="notes on this page"></div>
      <div class="toasts" role="status" aria-live="polite"></div>
    </div>
  `;

  const $ = (s) => root.querySelector(s);
  const ui = $('.ui');
  const hi = $('.hi'), pad = $('.pad'), meta = $('.meta');
  const dock = $('.dock'), crumbs = $('.crumbs'), palette = $('.palette'), rail = $('.rail');
  const led = $('.led'), msg = $('.msg'), filter = $('.filter'), list = $('.list');
  const targetLabel = $('.palette .target'), prompt = root.querySelector('textarea');
  const run = $('.run'), countWrap = $('.count'), toasts = $('.toasts');
  const knobs = $('.knobs');

  const state = {
    mode: null, el: null, action: null, count: 3,
    pendingId: null, variants: [], chosen: null, lastAccept: null, active: 0,
    insert: null, params: {}, notes: [],
  };

  // ------------------------------------------------------------ status

  function status(kind, text) {
    led.dataset.s = kind;
    msg.textContent = text;
  }

  function toast(kind, title, detail) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.dataset.kind = kind;
    el.innerHTML = `<div class="t"></div><div class="d"></div>`;
    el.querySelector('.t').textContent = title;
    el.querySelector('.d').textContent = detail || '';
    toasts.appendChild(el);
    setTimeout(() => el.remove(), kind === 'error' ? 9000 : 4500);
  }

  // ------------------------------------------------------------ highlight

  function paintHighlight(el, locked) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    Object.assign(hi.style, {
      display: 'block', left: `${r.x}px`, top: `${r.y}px`,
      width: `${r.width}px`, height: `${r.height}px`,
    });
    hi.classList.toggle('locked', !!locked);

    // Padding box, drawn the way devtools does it - spacing is the thing people
    // are usually actually looking at, and guessing it from a screenshot is how
    // spacing bugs survive review.
    const p = ['Top', 'Right', 'Bottom', 'Left'].map((s) => parseFloat(cs[`padding${s}`]) || 0);
    if (p.some(Boolean)) {
      Object.assign(pad.style, {
        display: 'block', left: `${r.x + p[3]}px`, top: `${r.y + p[0]}px`,
        width: `${Math.max(0, r.width - p[1] - p[3])}px`,
        height: `${Math.max(0, r.height - p[0] - p[2])}px`,
      });
    } else {
      pad.style.display = 'none';
    }

    meta.innerHTML = '';
    const b = document.createElement('b');
    b.textContent = label(el);
    const s = document.createElement('span');
    s.textContent = `${Math.round(r.width)}×${Math.round(r.height)}`;
    meta.append(b, s);

    // Contrast is reported where the element is, not in a report read later. If it
    // fails, the number is the first thing in view while the element is still
    // selected and still cheap to change.
    if ((el.textContent || '').trim() && el.children.length === 0) {
      const c = contrastOf(el);
      if (c) {
        const v = document.createElement('span');
        v.textContent = `${c.ratio.toFixed(2)}:1 ${c.passes ? 'AA' : `below ${c.floor}`}`;
        if (!c.passes) v.style.cssText = 'opacity:1;font-weight:700';
        meta.append(v);
      }
    }
    const top = r.y < 22 ? r.y + r.height + 22 : r.y;
    Object.assign(meta.style, { display: 'block', left: `${r.x}px`, top: `${top}px` });
  }

  function clearHighlight() {
    for (const n of [hi, pad, meta]) n.style.display = 'none';
  }

  // ------------------------------------------------------------ measuring

  // The effective background behind an element: the first ancestor that actually
  // paints one. Reading `backgroundColor` off the element itself reports
  // transparent for most text, which is how contrast gets "checked" and still ships
  // failing.
  function effectiveBg(el) {
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const parts = bg.match(/[\d.]+/g);
      if (parts && (parts.length < 4 || Number(parts[3]) > 0.95)) return parts.map(Number);
    }
    return [255, 255, 255];
  }

  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

  // Same WCAG math the skill's color.py uses, run on what the browser actually
  // painted rather than on what the source said. Overlays, gradients and images
  // behind text are invisible to a source-level check and common in practice.
  function contrastOf(el) {
    const cs = getComputedStyle(el);
    const fg = (cs.color.match(/[\d.]+/g) || []).map(Number);
    if (fg.length < 3) return null;
    const bg = effectiveBg(el);
    const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
    const ratio = (a + 0.05) / (b + 0.05);
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    return { ratio, large, floor: large ? 3 : 4.5, passes: ratio >= (large ? 3 : 4.5) };
  }

  // ------------------------------------------------------------ picking

  function setMode(mode) {
    state.mode = state.mode === mode ? null : mode;
    for (const b of dock.querySelectorAll('button[data-act]')) {
      b.setAttribute('aria-pressed', String(b.dataset.act === state.mode));
    }
    host.style.pointerEvents = state.mode === 'pick' || state.mode === 'insert' ? 'auto' : 'none';
    if (state.mode !== 'insert') caret.style.display = 'none';
    if (state.mode === 'pick') status('idle', 'click an element · ↑↓ to widen');
    else if (state.mode === 'insert') status('idle', 'click where the new thing goes');
    else if (!state.el) clearHighlight();
    else paintHighlight(state.el, true);
  }

  // The overlay covers the page while picking, so hit-test underneath it. Hide
  // the HOST, not the inner .ui: in pick mode the host takes pointer events, so
  // hiding only its child leaves the host itself as the topmost hit and every
  // pick returns the overlay.
  const under = (e) => {
    const prev = host.style.visibility;
    host.style.visibility = 'hidden';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    host.style.visibility = prev;
    return el && el.closest('[data-parti-overlay]') ? null : el;
  };

  function select(el, keepMode) {
    if (!el || el === document.body || el === document.documentElement) return;
    if (el.closest && el.closest('[data-parti-overlay]')) return;
    state.el = el;
    if (!keepMode) setMode(null);
    paintHighlight(el, true);
    drawCrumbs(el);
    targetLabel.textContent = selectorFor(el);
    post('/snapshot', { name: el.tagName.toLowerCase(), ...anatomyOf(el) });
  }

  // Widen and narrow. Picking the wrong depth is the single most common failure
  // of click-to-select, so it gets a first-class control rather than a re-click.
  function widen() {
    const p = state.el && state.el.parentElement;
    if (p && p !== document.body) { state.lastChild = state.el; select(p, true); }
  }
  function narrow() {
    const kid = (state.lastChild && state.lastChild.parentElement === state.el)
      ? state.lastChild
      : state.el && state.el.firstElementChild;
    if (kid) select(kid, true);
  }

  function drawCrumbs(el) {
    const chain = [];
    for (let n = el; n && n !== document.body && chain.length < 7; n = n.parentElement) chain.unshift(n);
    crumbs.innerHTML = '';
    chain.forEach((n, i) => {
      if (i) {
        const c = document.createElement('span');
        c.className = 'caret';
        c.textContent = '›';
        crumbs.appendChild(c);
      }
      const b = document.createElement('button');
      b.textContent = label(n);
      b.setAttribute('aria-current', String(n === el));
      b.onmouseenter = () => paintHighlight(n, false);
      b.onmouseleave = () => state.el && paintHighlight(state.el, true);
      b.onclick = () => select(n, true);
      crumbs.appendChild(b);
    });
    // One chip says nothing the size badge does not already say. The breadcrumb
    // earns its space only once there is somewhere to climb to.
    if (chain.length < 2) return void (crumbs.style.display = 'none');
    const r = el.getBoundingClientRect();
    crumbs.style.display = 'flex';
    crumbs.style.left = `${Math.max(12, Math.min(r.x, innerWidth - crumbs.offsetWidth - 12))}px`;
    crumbs.style.top = `${r.y > 76 ? r.y - 44 : r.y + r.height + 12}px`;
    crumbs.scrollLeft = crumbs.scrollWidth;
  }

  // ------------------------------------------------------------ insert mode

  // Insert answers the question pick cannot: "there is nothing here yet, put
  // something in this gap". The anchor is an existing element plus a side, because
  // a position with no anchor cannot survive a reload.
  const caret = $('.caret');

  function insertTargetAt(e) {
    const el = under(e);
    if (!el || el === document.body) return null;
    const r = el.getBoundingClientRect();
    // Horizontal flow inserts left or right; everything else inserts above or below.
    const parent = el.parentElement;
    const row = parent && /flex|grid/.test(getComputedStyle(parent).display) &&
      /row/.test(getComputedStyle(parent).flexDirection || 'row');
    const position = row
      ? (e.clientX < r.x + r.width / 2 ? 'before' : 'after')
      : (e.clientY < r.y + r.height / 2 ? 'before' : 'after');
    return { el, position, rect: r, row };
  }

  function paintCaret(t) {
    if (!t) return void (caret.style.display = 'none');
    const { rect: r, position, row } = t;
    const thick = 3;
    Object.assign(caret.style, {
      display: 'block',
      left: `${row ? (position === 'before' ? r.x - thick : r.right) : r.x}px`,
      top: `${row ? r.y : (position === 'before' ? r.y - thick : r.bottom)}px`,
      width: `${row ? thick : r.width}px`,
      height: `${row ? r.height : thick}px`,
    });
  }

  addEventListener('mousemove', (e) => {
    if (state.mode === 'pick') {
      const el = under(e);
      if (el) paintHighlight(el, false);
      return;
    }
    if (state.mode === 'insert') paintCaret(insertTargetAt(e));
  }, true);

  addEventListener('click', (e) => {
    if (state.mode === 'pick') {
      const el = under(e);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      select(el);
      openPalette();
      return;
    }
    if (state.mode === 'insert') {
      const t = insertTargetAt(e);
      if (!t) return;
      e.preventDefault();
      e.stopPropagation();
      state.insert = {
        position: t.position,
        anchor: selectorFor(t.el),
        anchorLabel: label(t.el),
        placeholder: { width: Math.round(t.rect.width), height: Math.round(t.rect.height) },
      };
      state.el = t.el;
      setMode(null);
      caret.style.display = 'none';
      openPalette();
    }
  }, true);

  addEventListener('scroll', () => {
    if (state.el && palette.style.display !== 'block') { paintHighlight(state.el, true); drawCrumbs(state.el); }
  }, true);
  addEventListener('resize', () => state.el && paintHighlight(state.el, true));

  // ------------------------------------------------------------ palette

  // Anchor a panel next to the element being worked on without covering it. The
  // whole point of picking an element is to look at it; a panel parked on top of
  // it is the tool getting in the way of the work.
  function place(panel, r, gap) {
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const fits = (x, y) =>
      x >= gap && y >= gap && x + w <= innerWidth - gap && y + h <= innerHeight - gap;
    const clampX = (x) => Math.max(gap, Math.min(x, innerWidth - w - gap));
    const clampY = (y) => Math.max(gap, Math.min(y, innerHeight - h - gap));

    const candidates = [
      [r.right + gap, clampY(r.y)],              // right of it
      [r.x - w - gap, clampY(r.y)],              // left of it
      [clampX(r.x), r.bottom + gap],             // below
      [clampX(r.x), r.y - h - gap],              // above
    ];
    const hit = candidates.find(([x, y]) => fits(x, y)) || [clampX(r.x), clampY(r.bottom + gap)];
    panel.style.left = `${hit[0]}px`;
    panel.style.top = `${hit[1]}px`;
  }

  function renderOptions() {
    const q = filter.value.trim().toLowerCase();
    const hits = ACTIONS.filter(([n, h]) => !q || n.includes(q) || h.includes(q));
    state.active = Math.min(state.active, Math.max(0, hits.length - 1));
    list.innerHTML = '';
    hits.forEach(([name, hint, key], i) => {
      const b = document.createElement('button');
      b.className = 'opt';
      b.dataset.action = name;
      b.dataset.active = String(i === state.active);
      b.setAttribute('role', 'option');
      b.innerHTML = `<span class="name"></span><span class="hint"></span><kbd></kbd>`;
      b.querySelector('.name').textContent = name;
      b.querySelector('.hint').textContent = hint;
      b.querySelector('kbd').textContent = key;
      b.onmouseenter = () => { state.active = i; renderOptions(); };
      b.onclick = () => choose(name);
      list.appendChild(b);
    });
    state.hits = hits;
  }

  function choose(name) {
    state.action = name;
    run.disabled = false;
    for (const o of list.querySelectorAll('.opt')) {
      o.dataset.active = String(o.dataset.action === name);
    }
    if (name === 'freeform') prompt.focus();
    else fire();
  }

  function openPalette() {
    if (!state.el) return toast('warn', 'Pick an element first', 'Press P, then click the part you want to work on.');
    palette.style.display = 'block';
    place(palette, state.el.getBoundingClientRect(), 12);
    filter.value = '';
    state.active = 0;
    renderOptions();
    if (state.insert) {
      targetLabel.textContent = `insert ${state.insert.position} ${state.insert.anchorLabel}`;
      // Net-new content has no existing element to vary, so an action name alone
      // says nothing. The prompt is the brief, and it is required.
      state.action = 'freeform';
      run.disabled = false;
      prompt.focus();
      return;
    }
    filter.focus();
  }

  function closePalette() {
    palette.style.display = 'none';
    // Focus survives a hidden panel. Left on the filter input, every subsequent
    // keystroke reads as "the user is typing" and the shortcuts go dead.
    const focused = root.activeElement;
    if (focused && palette.contains(focused)) focused.blur();
  }

  for (const n of [2, 3, 4, 5]) {
    const b = document.createElement('button');
    b.textContent = String(n);
    b.setAttribute('aria-pressed', String(n === state.count));
    b.onclick = () => {
      state.count = n;
      for (const o of countWrap.children) o.setAttribute('aria-pressed', String(o === b));
    };
    countWrap.appendChild(b);
  }

  filter.oninput = renderOptions;
  run.onclick = fire;

  async function fire() {
    if (!state.el || !state.action) return;
    const brief = prompt.value.trim();
    if (state.insert && !brief) {
      return toast('warn', 'Say what to insert', 'There is no existing element to vary, so the prompt is the brief.');
    }
    run.disabled = true;
    closePalette();
    status('busy', state.insert
      ? `inserting ${state.count} options ${state.insert.position} ${state.insert.anchorLabel}`
      : `${state.action}: asking parti for ${state.count} variants`);
    // Notes are written to the session directory rather than inlined: a handful of
    // strokes is more coordinates than an event should carry, and a file the agent
    // opens on demand keeps the event readable.
    let annotations;
    if (state.notes.length) {
      const saved = await post('/annotations', {
        pageUrl: location.href,
        viewport: { w: innerWidth, h: innerHeight, dpr: devicePixelRatio },
        scrollY: window.scrollY,
        notes: state.notes,
      });
      annotations = { file: saved.path, overlay: saved.overlay, count: state.notes.length };
    }

    const res = await post('/event', {
      type: 'generate',
      mode: state.insert ? 'insert' : 'replace',
      action: state.action,
      count: state.count,
      freeformPrompt: brief || null,
      pageUrl: location.href,
      insert: state.insert || undefined,
      annotations,
      element: anatomyOf(state.el),
    });
    state.pendingId = res.id;
    busyControls(true);
    // Sent notes are cleared. Carrying them into the next action would silently
    // re-apply feedback the user already had answered.
    state.notes = [];
    paintInk();
    renderNotes();
    setNoteMode(false);
  }

  // Steer and cancel exist because the agent is working for tens of seconds and the
  // user can already see it is going the wrong way. Without them the only options
  // are wait for something unwanted, or reload and lose the session.
  function busyControls(on) {
    root.querySelector('[data-act="steer"]').hidden = !on;
    root.querySelector('[data-act="abort"]').hidden = !on;
  }

  // ------------------------------------------------------------ variants

  // After the agent writes variants into source and HMR reloads, the wrapper
  // exposes data-parti-variant nodes. The rail carries each variant's one-line
  // note and its token-drift count, so an off-spec option reads as off-spec at
  // the moment of choosing rather than after the commit.
  function mountRail(info = {}) {
    const nodes = [...document.querySelectorAll('[data-parti-variant]')];
    if (!nodes.length) return;
    state.variants = nodes.map((n) => n.dataset.partiVariant);
    rail.innerHTML = '';
    rail.style.display = 'flex';
    ui.dataset.rail = 'on';
    const vs = document.createElement('div');
    vs.className = 'vs';
    rail.appendChild(vs);

    nodes.forEach((node, i) => {
      const name = node.dataset.partiVariant;
      const vinfo = (info.variants && info.variants[name]) || {};
      const drift = vinfo.lint || (info.lint && info.lint[name]) || [];
      const b = document.createElement('button');
      b.className = 'v';
      b.dataset.variant = name;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = `<span class="top"><kbd></kbd><span class="nm"></span><span class="drift"></span></span><span class="note"></span>`;
      b.querySelector('kbd').textContent = String(i + 1);
      b.querySelector('.nm').textContent = vinfo.label || name;
      if (drift.length) {
        const d = b.querySelector('.drift');
        d.textContent = `⚠ ${drift.length}`;
        d.title = drift.join('\n');
      }
      b.querySelector('.note').textContent = vinfo.note || 'variant';
      b.onclick = () => show(name);
      vs.appendChild(b);
    });

    const act = document.createElement('div');
    act.className = 'act';
    act.innerHTML =
      `<button class="ok">Accept <kbd>↵</kbd></button><button class="no">Discard <kbd>⌫</kbd></button>`;
    act.querySelector('.ok').onclick = accept;
    act.querySelector('.no').onclick = discard;
    rail.appendChild(act);

    show(state.variants[0]);
    // Lift the dock by what the rail actually measures, not a guessed constant:
    // the rail's height changes with variant count and label length.
    ui.style.setProperty('--rail-lift', `${rail.offsetHeight + 30}px`);
    status('idle', `${state.variants.length} variants · 1-${state.variants.length} to compare`);
  }

  function hideRail() {
    rail.style.display = 'none';
    delete ui.dataset.rail;
    ui.style.removeProperty('--rail-lift');
    knobs.innerHTML = '';
    delete knobs.dataset.open;
  }

  function show(name) {
    for (const v of document.querySelectorAll('[data-parti-variant]')) {
      v.hidden = v.dataset.partiVariant !== name;
    }
    for (const b of rail.querySelectorAll('.v')) {
      b.setAttribute('aria-pressed', String(b.dataset.variant === name));
    }
    state.chosen = name;
    mountKnobs(name);
  }

  // Knobs come from the variant itself: the agent declares which axes are tunable
  // as a JSON manifest on the element, and each knob writes a custom property that
  // the variant's own CSS already reads. Nothing here invents a style - it moves a
  // value the variant was written to accept.
  function mountKnobs(name) {
    const node = document.querySelector(`[data-parti-variant="${CSS.escape(name)}"]`);
    knobs.innerHTML = '';
    delete knobs.dataset.open;
    if (!node || !node.dataset.partiParams) return;

    let params;
    try {
      params = JSON.parse(node.dataset.partiParams);
    } catch {
      return toast('warn', 'Variant knobs skipped', `${name} declared parameters that are not valid JSON.`);
    }
    if (!Array.isArray(params) || !params.length) return;

    const heading = document.createElement('h5');
    heading.textContent = `tune ${name}`;
    knobs.appendChild(heading);

    const saved = (state.params[name] ||= {});
    for (const p of params.slice(0, 4)) {
      if (!p || !p.name || !p.var) continue;
      const wrap = document.createElement('div');
      wrap.className = 'knob';
      const id = `knob-${name}-${p.name}`;
      const top = document.createElement('div');
      top.className = 'top';
      const lab = document.createElement('label');
      lab.setAttribute('for', id);
      lab.textContent = p.label || p.name;
      const val = document.createElement('span');
      val.className = 'val';
      top.append(lab, val);
      wrap.appendChild(top);

      let input;
      if (p.type === 'select' && Array.isArray(p.options)) {
        input = document.createElement('select');
        for (const o of p.options) {
          const opt = document.createElement('option');
          opt.value = String(o);
          opt.textContent = String(o);
          input.appendChild(opt);
        }
      } else if (p.type === 'toggle') {
        input = document.createElement('input');
        input.type = 'checkbox';
      } else {
        input = document.createElement('input');
        input.type = 'range';
        input.min = p.min ?? 0;
        input.max = p.max ?? 1;
        input.step = p.step ?? 0.05;
      }
      input.id = id;

      const current = saved[p.name] ?? p.value;
      if (input.type === 'checkbox') input.checked = Boolean(current);
      else input.value = String(current ?? '');

      const apply = () => {
        const v = input.type === 'checkbox' ? (input.checked ? (p.on ?? '1') : (p.off ?? '0')) : input.value;
        node.style.setProperty(p.var, p.unit ? `${v}${p.unit}` : String(v));
        val.textContent = p.unit ? `${v}${p.unit}` : String(v);
        saved[p.name] = input.type === 'checkbox' ? input.checked : v;
      };
      input.addEventListener('input', apply);
      apply();

      wrap.appendChild(input);
      knobs.appendChild(wrap);
    }

    if (knobs.children.length > 1) {
      knobs.dataset.open = '1';
      // Above the rail and aligned to its left edge. Centring it would put it under
      // the dock, which lives above the rail on the right - two panels fighting for
      // the same corner while the user is trying to compare variants.
      const r = rail.getBoundingClientRect();
      knobs.style.left = `${Math.max(12, r.left)}px`;
      knobs.style.top = `${Math.max(12, r.top - knobs.offsetHeight - 10)}px`;
      // One stack at the bottom edge: rail, then knobs, then the dock above both.
      // Lifting the dock over the rail alone leaves it sitting on the knob panel.
      ui.style.setProperty('--rail-lift', `${rail.offsetHeight + knobs.offsetHeight + 40}px`);
    }
  }

  function accept() {
    if (!state.chosen) return;
    hideRail();
    status('busy', `accepting ${state.chosen} into source`);
    state.lastAccept = state.chosen;
    // The values go with the accept. A variant tuned in the browser and written to
    // source at its declared defaults is the tuning silently thrown away.
    post('/event', {
      type: 'accept',
      variant: state.chosen,
      params: state.params[state.chosen] || undefined,
      pageUrl: location.href,
    });
  }

  function discard() {
    hideRail();
    status('busy', 'restoring the original');
    post('/event', { type: 'discard', pageUrl: location.href });
  }

  // ------------------------------------------------------------ text edit

  function editText() {
    if (!state.el) return toast('warn', 'Pick an element first', 'Press P, then click the text you want to change.');
    const el = state.el;
    const before = el.textContent;
    el.setAttribute('contenteditable', 'plaintext-only');
    el.focus();
    status('idle', 'editing text · click away to save');
    const finish = () => {
      el.removeAttribute('contenteditable');
      el.removeEventListener('blur', finish);
      setMode(null);
      if (el.textContent === before) return status('idle', 'ready');
      status('busy', 'writing your edit into source');
      post('/event', {
        type: 'manual_edit', pageUrl: location.href,
        element: anatomyOf(el), before, after: el.textContent,
      }).then((r) => (state.pendingId = r.id));
    };
    el.addEventListener('blur', finish);
    setMode('edit');
  }

  // ------------------------------------------------------------ annotations

  // Marks are anchored to elements, not to a picture. parti does not rasterize the
  // page: doing that without a dependency means serializing the DOM into an SVG
  // foreignObject, which silently drops cross-origin images, taints the canvas, and
  // substitutes fallback fonts - a picture that lies about the design is worse for
  // judging it than no picture. An element-anchored note survives a reload, points
  // at something the agent can open, and says what is wrong in the user's words.
  const ink = $('.ink');
  const notes = $('.notes');

  function elementUnderPoint(x, y) {
    const prev = host.style.visibility;
    host.style.visibility = 'hidden';
    const el = document.elementFromPoint(x, y);
    host.style.visibility = prev;
    return el && !el.closest('[data-parti-overlay]') ? el : null;
  }

  function renderNotes() {
    notes.innerHTML = '';
    if (!state.notes.length) {
      delete notes.dataset.open;
      return;
    }
    notes.dataset.open = '1';
    const h = document.createElement('h5');
    h.textContent = `${state.notes.length} note${state.notes.length > 1 ? 's' : ''}`;
    notes.appendChild(h);

    state.notes.forEach((note, i) => {
      const row = document.createElement('div');
      row.className = 'note-row';
      row.innerHTML = `<span class="n"></span><span class="what"></span><button title="remove">×</button>`;
      row.querySelector('.n').textContent = String(i + 1);
      const what = row.querySelector('.what');
      what.textContent = note.text || (note.kind === 'stroke' ? 'marked area' : 'pin');
      const small = document.createElement('small');
      small.textContent = note.target || 'page';
      what.appendChild(small);
      row.querySelector('button').onclick = () => {
        state.notes.splice(i, 1);
        paintInk();
        renderNotes();
      };
      notes.appendChild(row);
    });

    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = 'Notes are sent with the next action.';
    notes.appendChild(hint);
  }

  function paintInk() {
    ink.innerHTML = '';
    for (const old of root.querySelectorAll('.pin')) old.remove();

    state.notes.forEach((note, i) => {
      if (note.kind === 'stroke') {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${note.points.map((p) => `${p[0]} ${p[1]}`).join(' L ')}`);
        ink.appendChild(path);
        const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        box.setAttribute('class', 'zone');
        box.setAttribute('x', note.box.x);
        box.setAttribute('y', note.box.y);
        box.setAttribute('width', note.box.w);
        box.setAttribute('height', note.box.h);
        ink.appendChild(box);
      }
      const pin = document.createElement('div');
      pin.className = 'pin';
      pin.textContent = String(i + 1);
      pin.style.left = `${note.at[0]}px`;
      pin.style.top = `${note.at[1]}px`;
      pin.title = note.text || '';
      $('.ui').appendChild(pin);
    });
  }

  function addNote(kind, at, points) {
    const el = elementUnderPoint(at[0], at[1]);
    const text = window.prompt(
      kind === 'stroke' ? 'What is wrong with this area?' : 'What is wrong here?'
    );
    if (text === null) return; // cancelled: leave no mark
    const note = {
      kind,
      at,
      text: text.trim(),
      target: el ? selectorFor(el) : null,
      targetLabel: el ? label(el) : null,
    };
    if (points) {
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      note.points = points;
      note.box = {
        x: Math.min(...xs), y: Math.min(...ys),
        w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys),
      };
      // Everything the stroke actually crosses, so "this row" reaches the agent as
      // a list of elements rather than a rectangle it has to guess about.
      const covered = new Set();
      for (const p of points) {
        const hit = elementUnderPoint(p[0], p[1]);
        if (hit) covered.add(selectorFor(hit));
      }
      note.covers = [...covered].slice(0, 8);
    }
    state.notes.push(note);
    paintInk();
    renderNotes();
  }

  // Drag draws, click drops a pin. One pointer gesture, told apart by distance.
  let drawing = null;
  ink.addEventListener('pointerdown', (e) => {
    drawing = { points: [[e.clientX, e.clientY]] };
    ink.setPointerCapture(e.pointerId);
  });
  ink.addEventListener('pointermove', (e) => {
    if (!drawing) return;
    drawing.points.push([e.clientX, e.clientY]);
    const path = ink.querySelector('path.live') || (() => {
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('class', 'live');
      ink.appendChild(p);
      return p;
    })();
    path.setAttribute('d', `M ${drawing.points.map((p) => `${p[0]} ${p[1]}`).join(' L ')}`);
  });
  ink.addEventListener('pointerup', (e) => {
    if (!drawing) return;
    const pts = drawing.points;
    drawing = null;
    ink.querySelector('path.live')?.remove();
    const dx = pts.at(-1)[0] - pts[0][0];
    const dy = pts.at(-1)[1] - pts[0][1];
    const dragged = Math.hypot(dx, dy) > 12 && pts.length > 3;
    addNote(dragged ? 'stroke' : 'pin', [e.clientX, e.clientY], dragged ? pts : null);
  });

  function setNoteMode(on) {
    ui.dataset.note = on ? 'on' : 'off';
    root.querySelector('[data-act="note"]').setAttribute('aria-pressed', String(on));
    status('idle', on ? 'drag to mark an area, click to drop a pin · N to finish' : 'ready');
    if (on) renderNotes();
  }

  // ------------------------------------------------------------ dock drag

  (function draggable() {
    const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE)); } catch { return null; } })();
    const place = (x, y) => {
      dock.style.left = `${Math.max(8, Math.min(x, innerWidth - dock.offsetWidth - 8))}px`;
      dock.style.top = `${Math.max(8, Math.min(y, innerHeight - dock.offsetHeight - 8))}px`;
      dock.style.right = 'auto';
      dock.style.bottom = 'auto';
    };
    if (saved) { place(saved.x, saved.y); dock.dataset.moved = ''; }

    const grip = root.querySelector('.grip');
    grip.addEventListener('pointerdown', (e) => {
      const r = dock.getBoundingClientRect();
      const dx = e.clientX - r.x, dy = e.clientY - r.y;
      grip.setPointerCapture(e.pointerId);
      const move = (ev) => place(ev.clientX - dx, ev.clientY - dy);
      const up = () => {
        grip.removeEventListener('pointermove', move);
        grip.removeEventListener('pointerup', up);
        const r2 = dock.getBoundingClientRect();
        dock.dataset.moved = '';
        try { localStorage.setItem(STORE, JSON.stringify({ x: r2.x, y: r2.y })); } catch { /* private mode */ }
      };
      grip.addEventListener('pointermove', move);
      grip.addEventListener('pointerup', up);
    });
  })();

  // ------------------------------------------------------------ keyboard

  const typing = (t) =>
    t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));

  addEventListener('keydown', (e) => {
    const inField = typing(e.target) || typing(root.activeElement);
    const paletteOpen = palette.style.display === 'block';

    if (e.key === 'Escape') {
      if (ui.dataset.note === 'on') { setNoteMode(false); return; }
      if (paletteOpen) { closePalette(); return; }
      if (state.mode) { setMode(null); return; }
      state.el = null; clearHighlight(); crumbs.style.display = 'none'; status('idle', 'ready');
      return;
    }

    if (paletteOpen && !e.metaKey && !e.ctrlKey) {
      const hits = state.hits || [];
      if (e.key === 'ArrowDown') { state.active = (state.active + 1) % hits.length; renderOptions(); e.preventDefault(); return; }
      if (e.key === 'ArrowUp') { state.active = (state.active - 1 + hits.length) % hits.length; renderOptions(); e.preventDefault(); return; }
      if (e.key === 'Enter') {
        // In the prompt field Enter runs what is already chosen; Shift+Enter stays
        // a newline. In the list, Enter chooses the highlighted action.
        if (root.activeElement === prompt) {
          if (e.shiftKey || !state.action) return;
          e.preventDefault();
          fire();
          return;
        }
        e.preventDefault();
        const pick = hits[state.active];
        if (pick) choose(pick[0]);
        return;
      }
      if (e.key === '/' && !inField) { prompt.focus(); e.preventDefault(); return; }
    }

    if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      paletteOpen ? closePalette() : openPalette();
      return;
    }

    if (inField) return;

    if (rail.style.display === 'flex') {
      const n = Number(e.key);
      if (n >= 1 && n <= state.variants.length) { show(state.variants[n - 1]); e.preventDefault(); return; }
      if (e.key === 'Enter') { accept(); e.preventDefault(); return; }
      if (e.key === 'Backspace') { discard(); e.preventDefault(); return; }
    }

    if (e.key === 'ArrowUp' && state.el) { widen(); e.preventDefault(); return; }
    if (e.key === 'ArrowDown' && state.el) { narrow(); e.preventDefault(); return; }
    if (e.key === 'p' || e.key === 'P') { state.insert = null; setMode('pick'); return; }
    if (e.key === 'i' || e.key === 'I') { state.insert = null; setMode('insert'); return; }
    if (e.key === 'k' || e.key === 'K') { openPalette(); return; }
    if (e.key === 'e' || e.key === 'E') { editText(); return; }
    if (e.key === 'n' || e.key === 'N') { setNoteMode(ui.dataset.note !== 'on'); return; }
    if ((e.key === 'z' || e.key === 'Z') && (e.metaKey || e.ctrlKey) && state.lastAccept) {
      post('/event', { type: 'undo', variant: state.lastAccept, pageUrl: location.href });
      status('busy', `undoing ${state.lastAccept}`);
      state.lastAccept = null;
    }
  }, true);

  // ------------------------------------------------------------ dock wiring

  root.querySelector('[data-act="pick"]').onclick = () => { state.insert = null; setMode('pick'); };
  root.querySelector('[data-act="insert"]').onclick = () => { state.insert = null; setMode('insert'); };

  // A real narrow window, not a fake one. Scaling the page down inside this tab
  // would not re-run a single media query, so it would show a shrunken desktop
  // layout and call it mobile - worse than not offering the button.
  root.querySelector('[data-act="narrow"]').onclick = () => {
    const w = window.open(location.href, 'parti-narrow', 'width=390,height=844');
    if (!w) toast('warn', 'Popup blocked', 'Allow popups for this origin to open the narrow view.');
  };

  root.querySelector('[data-act="steer"]').onclick = () => {
    const note = window.prompt('What should change about what parti is doing?');
    if (!note || !note.trim()) return;
    post('/event', { type: 'steer', note: note.trim(), pendingId: state.pendingId });
    status('busy', 'steering');
  };

  root.querySelector('[data-act="abort"]').onclick = () => {
    post('/event', { type: 'abort', pendingId: state.pendingId });
    busyControls(false);
    status('idle', 'cancelled');
  };
  root.querySelector('[data-act="palette"]').onclick = openPalette;
  root.querySelector('[data-act="edit"]').onclick = editText;
  root.querySelector('[data-act="note"]').onclick = () => setNoteMode(ui.dataset.note !== 'on');
  root.querySelector('[data-act="exit"]').onclick = () => {
    post('/event', { type: 'exit' });
    host.remove();
    pageCss.remove();
    window.__PARTI_LIVE_MOUNTED__ = false;
  };

  // ------------------------------------------------------------ transport

  let es;
  function connect() {
    es = new EventSource(`${API}/events`);
    es.onopen = () => status('idle', 'ready');
    es.onerror = () => {
      status('down', 'helper offline · reconnecting');
      es.close();
      setTimeout(connect, 2000);
    };
    es.onmessage = (m) => {
      const ev = JSON.parse(m.data);
      // progress is non-terminal: real steps beat a spinner that means nothing.
      if (ev.type === 'progress') return status('busy', String(ev.message || 'working'));
      if (ev.type !== 'reply') return;
      state.pendingId = null;
      busyControls(false);
      if (ev.status === 'variants_ready') return mountRail(ev.message || {});
      if (ev.status === 'error') {
        status('idle', 'ready');
        return toast('error', 'parti hit a problem', String(ev.message || ''));
      }
      status('idle', 'ready');
      if (ev.message) toast('info', String(ev.message.title || 'done'), ev.message.detail);
    };
  }
  connect();

  // Variants survive a reload; re-mount the rail if the wrapper is still there.
  if (document.querySelector('[data-parti-variant]')) mountRail();
})();
