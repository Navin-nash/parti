#!/usr/bin/env node
// Agent side of the live session. One-shot long poll, plus reply and status.
//
//   node live/poll.mjs --port P --token T                 wait for the next event
//   node live/poll.mjs --port P --token T --reply ID --status variants_ready \
//        --message '{"lint":{"A":[]}}'                    unblock the browser
//   node live/poll.mjs --port P --token T --status-only   queue state, no waiting
//
// Run the poll as a background task on harnesses that notify on completion, and
// in the foreground on those that do not. Never pass a short timeout: a short
// timeout turns one parked request into a polling loop that burns turns.

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const key = a.slice(2);
    const next = process.argv[i + 1];
    if (!next || next.startsWith('--')) args.set(key, true);
    else { args.set(key, next); i++; }
  }
}

const port = args.get('port') || process.env.PARTI_LIVE_PORT;
const token = args.get('token') || process.env.PARTI_LIVE_TOKEN;
if (!port || !token) {
  console.log(JSON.stringify({ ok: false, error: 'port_and_token_required' }));
  process.exit(1);
}
const base = `http://127.0.0.1:${port}`;

const out = (payload) => console.log(JSON.stringify(payload, null, 2));

try {
  if (args.get('status-only')) {
    out(await (await fetch(`${base}/status`)).json());
  } else if (args.get('reply')) {
    let message = args.get('message');
    if (typeof message === 'string') {
      try { message = JSON.parse(message); } catch { /* plain string is fine */ }
    }
    const res = await fetch(`${base}/reply`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-parti-token': token },
      body: JSON.stringify({ id: args.get('reply'), status: args.get('status') || 'done', message }),
    });
    out(await res.json());
  } else {
    const timeout = args.get('timeout') || 600000;
    const res = await fetch(`${base}/poll?timeout=${timeout}&token=${token}`);
    out(await res.json());
  }
} catch (err) {
  // A refused connection means the helper is gone; the journal still holds the
  // truth, so say which recovery command to run rather than just failing.
  out({ ok: false, error: String(err && err.message), hint: 'helper down - rerun live/boot.mjs, it requeues unacked events from the journal' });
  process.exit(1);
}
