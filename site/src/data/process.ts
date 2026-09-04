/**
 * The seven-stage direction process, transcribed from SKILL.md.
 *
 * `pivotal` marks stage 03. It is flagged throughout the site because skipping
 * it is invisible in the output: the result still looks like a design was
 * done, and three directions that differ only in palette are one direction
 * wearing three hats.
 */
export interface ProcessStage {
  index: string;
  title: string;
  short: string;
  fields: string[];
  detail: string;
  /** What it looks like when this stage is skipped. */
  skipped: string;
  pivotal?: boolean;
}

export const PROCESS: ProcessStage[] = [
  {
    index: "01",
    title: "Establish the brief",
    short: "Five things, asked once - not an interrogation.",
    fields: ["Subject", "Audience", "Job", "Content", "Constraints"],
    detail:
      "Subject: what it is, concretely. Audience: who uses it and what they already use daily, because that is their baseline for normal. Job: the one thing a person must be able to do. Content: what actually goes on screen, in what volume. Constraints: DESIGN.md, existing brand, platform, accessibility floor, taste vetoes. If the brief stays thin, pin it yourself and say so - an assumption stated beats a direction hedged to fit everyone. Then force a priority ranking, because modern, intuitive, interactive and intentional genuinely conflict.",
    skipped:
      "The design gets made for a category rather than a product, and every review comment becomes a matter of taste because there is nothing to check a decision against.",
  },
  {
    index: "02",
    title: "Derive constraints before style",
    short: "The step that decides whether anything downstream is earned.",
    fields: ["Density", "Register", "Attention", "Frequency", "Material"],
    detail:
      "What information density does the content actually demand? What emotional register does the job call for? Where does attention need to land, in order, in the first three seconds? What is the frequency of use - daily tools earn density and shortcuts, occasional tools earn hand-holding? And what is the subject's native material: its instruments, artifacts, vernacular, textures? That last question is where distinctive choices come from, and it is the well you draw from every time you replace a tell.",
    skipped:
      "Style gets selected instead of derived, and the rationale gets written afterwards to fit.",
  },
  {
    index: "03",
    title: "Three divergent directions",
    short: "Each pair must differ on at least two of six axes.",
    fields: ["Density", "Structure", "Type voice", "Chroma", "Motion", "Depth"],
    detail:
      "Three directions differing only in palette are one direction. The gate before drafting further: if swapping only the palette between two of them would leave everything else unchanged, that is one direction, not two. Each must land differently even in grayscale. For each, state a thesis about what it believes about the user, its nearest movement and where it departs, palette with roles, type with reasons, structure, motion posture, signature, and cost - because every direction gives something up, and being unable to name what it gives up means a compromise was made rather than a choice.",
    skipped:
      "One direction gets presented as three, the client picks the middle one, and everyone believes an exploration happened.",
    pivotal: true,
  },
  {
    index: "04",
    title: "Render them",
    short: "Show, do not describe. Real content, one viewport.",
    fields: ["Real content", "One screen", "Faithful", "Comparable", "Motion"],
    detail:
      "Text descriptions let both of you imagine different things and agree anyway. Render each as a visual with real content - lorem and Feature One hide every hierarchy problem. One screen, the key one, where the job gets done. Faithful rather than polished: type scale, spacing rhythm and colour relationships must be right; edge states need not be. Same content, same viewport, same screen across all three. And include the motion, at least the signature moment - a still image of a choreographed direction is a misrepresentation.",
    skipped:
      "A spec-perfect direction still ships generic, because construction is where concept-level work either survives or gets erased.",
  },
  {
    index: "05",
    title: "Critique your own three",
    short: "Three tests, run against your own work before showing it.",
    fields: ["Generic-prompt", "Remove one", "Spend boldness once"],
    detail:
      "The generic-prompt test: would you have produced roughly this for a different subject in the same category? If yes, nothing here came from this brief. Chanel's mirror: remove one accessory from each and name what you removed. Spend boldness once: one signature element is memorable, two are noise. Say what you changed and why - a direction that survives this unchanged was probably too safe.",
    skipped:
      "The first plausible direction ships, and its weakest element is the one the client notices first.",
  },
  {
    index: "06",
    title: "Converge",
    short: "Recommend one. Name the condition that would change it.",
    fields: ["Recommend", "Switch if", "Would regret"],
    detail:
      "Show all three before recommending, then recommend: this one, because the constraints point here. Switch to another if a specific stated condition holds. And name the one you would regret not building, with the piece of it that transplants into the winner. Presenting three options without a recommendation is not neutrality, it is deferring the decision to the person who hired you to make it.",
    skipped:
      "The decision gets made by whoever is most senior in the room rather than by the constraints.",
  },
  {
    index: "07",
    title: "Tokens, motion, DESIGN.md",
    short: "The binding spec. Tokens are law; craft is where you are free.",
    fields: ["Color", "Type", "Space", "Shape", "Motion", "Changelog"],
    detail:
      "Emit the full token spec, including motion specified concretely: posture, the one choreographed moment, what animates with duration and easing, what never animates, the library decision including the option of none, and per-item reduced-motion degradation. Then write or update DESIGN.md with a dated changelog line. Every colour, size, radius and duration lives in the spec and is never invented mid-build; all the latitude belongs to how a component gets constructed within those constraints.",
    skipped:
      "A good direction quietly reverts to defaults on the way to production, and nobody can point at the moment it happened.",
  },
];
