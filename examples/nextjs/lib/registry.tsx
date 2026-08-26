import type { ReactNode } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { StatusToken } from "@/components/ui/StatusToken";
import { Field } from "@/components/ui/Field";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { CTA } from "@/components/marketing/CTA";
import { SocialProof } from "@/components/marketing/SocialProof";
import { PricingTable } from "@/components/marketing/PricingTable";
import { FAQ } from "@/components/marketing/FAQ";
import { FlightRack } from "@/components/dashboard/FlightRack";
import { DisruptionQueue } from "@/components/dashboard/DisruptionQueue";
import { RackEmpty, RackLoading, RackError } from "@/components/states/RackStates";
import { FLIGHTS, DISRUPTIONS } from "@/lib/data";

export interface Entry {
  slug: string;
  name: string;
  group: "Primitives" | "Marketing" | "Board" | "States";
  file: string;
  /** the decision this component encodes — why it looks the way it does */
  note: string;
  /** full-bleed components opt out of the gallery's own padding */
  bleed?: boolean;
  render: () => ReactNode;
}

export const REGISTRY: Entry[] = [
  {
    slug: "button",
    name: "Button",
    group: "Primitives",
    file: "components/ui/Button.tsx",
    note: "Every control carries its verb. There is no icon-only variant — a dispatcher acting from muscle memory at hour ten needs the word. Press moves 1px and keeps its colour change under reduced motion.",
    render: () => (
      <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
        <Button variant="primary">Reassign aircraft</Button>
        <Button>Call reserve</Button>
        <Button variant="quiet">Add desk-log note</Button>
        <ButtonLink href="#" variant="primary" size="lg">Start a shadow shift</ButtonLink>
      </div>
    ),
  },
  {
    slug: "status-token",
    name: "StatusToken",
    group: "Primitives",
    file: "components/ui/StatusToken.tsx",
    note: "The signature element. Status is carried three ways at once — printed word, colour, and signed delta — so the board survives grayscale, peripheral vision and colour-vision deficiency. Colour alone is never the signal.",
    render: () => (
      <div style={{ display: "flex", gap: "var(--s-3)", flexWrap: "wrap" }}>
        <StatusToken state="normal" label="ON TIME" />
        <StatusToken state="caution" label="DELAYED" delta={45} />
        <StatusToken state="warning" label="DIVERTED" delta={102} />
        <StatusToken state="advisory" label="WATCH" />
        <StatusToken state="caution" label="CREW" delta={48} />
      </div>
    ),
  },
  {
    slug: "panel",
    name: "Panel",
    group: "Primitives",
    file: "components/ui/Panel.tsx",
    note: "The only container in the system, and it never nests. Interior grouping is a hairline plus a label. Elevation is a lightness step, never a shadow — at this ground luminance a drop shadow is invisible and a 4% lightness step is not.",
    render: () => (
      <div className="grid-2">
        <Panel title="Standard panel" meta={<span className="strip dim">e-1</span>}>
          <p className="small muted" style={{ margin: 0 }}>
            Surface plus a hairline border. The default resting elevation.
          </p>
        </Panel>
        <Panel title="Focused panel" meta={<span className="strip dim">e-2</span>} focus>
          <p className="small muted" style={{ margin: 0 }}>
            One lightness step up, stronger border. Used for the single panel holding
            attention — never more than one on screen.
          </p>
        </Panel>
      </div>
    ),
  },
  {
    slug: "field",
    name: "Field",
    group: "Primitives",
    file: "components/ui/Field.tsx",
    note: "Every value a dispatcher reads as data is monospace and tabular, so columns align and digits do not jitter when the board refreshes every ten seconds.",
    render: () => (
      <div style={{ display: "flex", gap: "var(--s-8)", flexWrap: "wrap" }}>
        <Field label="Tail" value="N612CR" />
        <Field label="Type" value="CRJ-900" />
        <Field label="STD" value="14:05Z" />
        <Field label="ETD" value="15:47Z" />
        <Field label="Bay" value="A3" />
      </div>
    ),
  },
  {
    slug: "hero",
    name: "Hero",
    group: "Marketing",
    file: "components/marketing/Hero.tsx",
    note: "Renders the actual product rather than an illustration of it. A marketing page for a dispatch tool that shows a stock image is arguing the board is not the selling point.",
    bleed: true,
    render: () => <Hero />,
  },
  {
    slug: "features",
    name: "Features",
    group: "Marketing",
    file: "components/marketing/Features.tsx",
    note: "Sequence markers are real dispatch units (T+0:00, T+0:40, T+3:40), not 01 / 02 / 03. Numbering is only honest when the content genuinely is a sequence — here it is the elapsed clock of an event.",
    bleed: true,
    render: () => <Features />,
  },
  {
    slug: "cta",
    name: "CTA",
    group: "Marketing",
    file: "components/marketing/CTA.tsx",
    note: "The generic default CTA pair is avoided: it says nothing about what happens next. These name the actual next step for this audience — a shadow shift beside the existing board.",
    bleed: true,
    render: () => <CTA />,
  },
  {
    slug: "social-proof",
    name: "SocialProof",
    group: "Marketing",
    file: "components/marketing/SocialProof.tsx",
    note: "No avatars and no wall of unnamed logos. This audience evaluates by fleet size and certificate type, so those are the figures, and the quote is attributed by role.",
    bleed: true,
    render: () => <SocialProof />,
  },
  {
    slug: "pricing-table",
    name: "PricingTable",
    group: "Marketing",
    file: "components/marketing/PricingTable.tsx",
    note: "The recommended tier is marked by a lightness step and a printed word — never a shadow, a gradient, or a scale transform. Priced per desk because that is the unit that does the work.",
    render: () => <PricingTable />,
  },
  {
    slug: "faq",
    name: "FAQ",
    group: "Marketing",
    file: "components/marketing/FAQ.tsx",
    note: "Native <details>, so it works before hydration and without JavaScript. The open transition animates grid-template-rows rather than height — height is a layout property and animating it forces reflow every frame.",
    render: () => <FAQ />,
  },
  {
    slug: "flight-rack",
    name: "FlightRack",
    group: "Board",
    file: "components/dashboard/FlightRack.tsx",
    note: "Fields print in the order a paper flight-progress strip prints them, because that order is already in this audience's hands. The rack scrolls sideways rather than truncating — a clipped tail number is an airworthiness risk.",
    render: () => <FlightRack flights={FLIGHTS} />,
  },
  {
    slug: "disruption-queue",
    name: "DisruptionQueue",
    group: "Board",
    file: "components/dashboard/DisruptionQueue.tsx",
    note: "The signature interaction: a disruption discloses in place so the dispatcher never loses board position to read one. No nested panels — each item is separated by a hairline.",
    render: () => <DisruptionQueue items={DISRUPTIONS} />,
  },
  {
    slug: "state-populated",
    name: "Rack · populated",
    group: "States",
    file: "components/dashboard/FlightRack.tsx",
    note: "The ideal state. Shipped in the same pass as the other three, never ahead of them — a build that only implements this one is how production quietly diverges from what was approved.",
    render: () => <FlightRack flights={FLIGHTS} />,
  },
  {
    slug: "state-empty",
    name: "Rack · empty",
    group: "States",
    file: "components/states/RackStates.tsx",
    note: "Names the filter that caused it and offers to clear it. An empty state reading 'No data' makes the dispatcher guess whether the board is broken or their filter is narrow.",
    render: () => <RackEmpty />,
  },
  {
    slug: "state-loading",
    name: "Rack · loading",
    group: "States",
    file: "components/states/RackStates.tsx",
    note: "Shape-matched skeletons, and only on first load. A background refresh keeps stale rows on screen — a dispatcher must never lose the board mid-decision because a poll came back slow.",
    render: () => <RackLoading />,
  },
  {
    slug: "state-error",
    name: "Rack · error",
    group: "States",
    file: "components/states/RackStates.tsx",
    note: "Says which feed died, when the data was last good, what to do instead, and gives a reference to quote. 'Something went wrong' is not a state, it is an apology.",
    render: () => <RackError />,
  },
];

export const GROUPS = ["Primitives", "Marketing", "Board", "States"] as const;

export function byGroup(group: string) {
  return REGISTRY.filter((e) => e.group === group);
}

export function bySlug(slug: string) {
  return REGISTRY.find((e) => e.slug === slug);
}
