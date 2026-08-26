/**
 * Real-shaped dispatch data. No placeholder copy anywhere — every hierarchy
 * problem hides behind placeholder content, so there isn't any here.
 *
 * Tails, types and city pairs are Pacific Northwest regional. Times are Zulu,
 * which is what a dispatcher actually reads.
 */

export type Signal = "normal" | "caution" | "warning" | "advisory";

export interface Flight {
  id: string;
  flight: string;
  tail: string;
  type: string;
  origin: string;
  dest: string;
  std: string;
  etd: string;
  /** minutes off schedule; negative is early */
  delta: number;
  state: Signal;
  /** the printed word — status is never colour alone */
  status: string;
  bay: string;
  crew: string;
  note?: string;
}

export const FLIGHTS: Flight[] = [
  { id: "1", flight: "HZ2214", tail: "N612CR", type: "CRJ-900", origin: "SEA", dest: "PSC",
    std: "14:05", etd: "15:47", delta: 102, state: "warning", status: "DIVERTED", bay: "A3",
    crew: "TATE / OKONKWO", note: "Hydraulic B low — MEL 29-11-02, ferry approved" },
  { id: "2", flight: "HZ1180", tail: "N718HZ", type: "E175", origin: "PDX", dest: "SFO",
    std: "14:20", etd: "15:05", delta: 45, state: "caution", status: "DELAYED", bay: "C1",
    crew: "REYES / MAHONEY", note: "SFO ground delay programme — EDCT 15:05Z" },
  { id: "3", flight: "HZ4402", tail: "N204SK", type: "Q400", origin: "GEG", dest: "SEA",
    std: "14:35", etd: "14:35", delta: 0, state: "normal", status: "ON TIME", bay: "B7",
    crew: "ILIC / BRANDT" },
  { id: "4", flight: "HZ3097", tail: "N551QX", type: "E175", origin: "SEA", dest: "BOI",
    std: "14:50", etd: "14:44", delta: -6, state: "normal", status: "ON TIME", bay: "A1",
    crew: "DUFRESNE / PARK" },
  { id: "5", flight: "HZ2260", tail: "N330CR", type: "CRJ-900", origin: "SEA", dest: "MFR",
    std: "15:10", etd: "15:58", delta: 48, state: "caution", status: "CREW", bay: "D2",
    crew: "AKAGI / — ", note: "FO duty limit 16:12Z — reserve callout in progress" },
  { id: "6", flight: "HZ1815", tail: "N889HZ", type: "E175", origin: "PDX", dest: "LAX",
    std: "15:25", etd: "15:25", delta: 0, state: "advisory", status: "WATCH", bay: "C4",
    crew: "OYELARAN / VOSS", note: "LAX arrival metering advisory" },
  { id: "7", flight: "HZ5521", tail: "N142SK", type: "Q400", origin: "SEA", dest: "YKM",
    std: "15:40", etd: "15:40", delta: 0, state: "normal", status: "ON TIME", bay: "B2",
    crew: "NAKASHIMA / ELLIS" },
];

export interface Disruption {
  id: string;
  flight: string;
  headline: string;
  detail: string;
  state: Signal;
  opened: string;
}

export const DISRUPTIONS: Disruption[] = [
  { id: "d1", flight: "HZ2214", state: "warning", opened: "13:52Z",
    headline: "Diversion to PSC — hydraulic B",
    detail: "Aircraft on ground PSC. 46 pax to rebook onto HZ4402/HZ5521. Maintenance ETA 17:30Z; ferry approved under MEL 29-11-02." },
  { id: "d2", flight: "HZ2260", state: "caution", opened: "14:07Z",
    headline: "FO duty timeout at 16:12Z",
    detail: "Reserve callout issued 14:05Z. If no acceptance by 15:20Z the rotation cancels and 51 pax reaccommodate to tomorrow 08:15Z." },
  { id: "d3", flight: "HZ1180", state: "caution", opened: "14:11Z",
    headline: "SFO ground delay programme",
    detail: "EDCT 15:05Z, 45 minutes off schedule. Downline HZ1181 turn is at risk below a 32-minute ground time." },
];

export const FEATURES = [
  { at: "T+0:00", title: "The board reads itself",
    body: "Every strip carries its state three ways — printed word, card stock, and a signed delta — so the rack is legible in peripheral vision and survives grayscale, a dimmed monitor, and colour-vision deficiency." },
  { at: "T+0:40", title: "Reassignment without re-reading",
    body: "Aircraft and crew swaps resolve against duty limits, MEL status and downline turns as you build them. The constraint that will break is shown before you commit, not after." },
  { at: "T+3:40", title: "The handover is the log",
    body: "Every action writes a desk-log line with the time, the dispatcher and the reason. Shift handover is the log, not a rebuilt story from memory." },
] as const;

export const TIERS = [
  { name: "Desk", price: "$340", unit: "per desk / month", forWho: "Single-base carriers running one dispatch desk.",
    features: ["One desk, unlimited flights", "Live board and rack", "Duty-limit checking", "Desk log and shift handover", "Email support, 24h"], cta: "Start a desk" },
  { name: "Operations", price: "$1,180", unit: "per desk / month", forWho: "Multi-base carriers with overlapping desks and a duty manager.",
    features: ["Everything in Desk", "Multi-desk handover", "Crew reserve integration", "MEL and maintenance feed", "IROPS replay and review", "Phone support, 1h"], cta: "Talk to operations", featured: true },
  { name: "Certificate", price: "Contact", unit: "annual, per certificate", forWho: "Carriers requiring on-premise deployment and records retention.",
    features: ["Everything in Operations", "On-premise or private cloud", "FAA records retention", "SSO and audit export", "Named dispatcher liaison", "Phone support, 15m"], cta: "Contact us" },
] as const;

export const FAQS = [
  { q: "Does Meridian file flight plans?", a: "No. Meridian is the desk surface for reassignment during irregular operations. It reads your existing flight-planning system and writes back the reassignment; it does not replace the planner or the release." },
  { q: "What happens when a feed dies?", a: "The affected values are withdrawn from the board and the panel states which feed failed and when the data was last good. Stale numbers are never displayed as current — a dispatcher acting on a silently frozen board is the failure mode the product exists to prevent." },
  { q: "Is there a light theme?", a: "Not today. The board is designed at the luminance of a dimmed ops room, and the row tints need re-derivation rather than inversion to work on a bright ground. It is on the roadmap and is tracked as an open question in our design record." },
  { q: "How long is onboarding?", a: "A certificated dispatcher is productive on the rack in one shift. The field order matches a printed strip, so there is no new vocabulary to learn — that is the point of the layout." },
] as const;
