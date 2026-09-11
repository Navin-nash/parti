import type { ComponentType } from "react";
import KilnShowcase from "./kiln";
import TorqueShowcase from "./torque";
import UndertowShowcase from "./undertow";
import DatumShowcase from "./datum";
import TandemShowcase from "./tandem";

/**
 * slug -> the real component that renders at /preview/[slug]. A miss here is
 * a data bug: every slug in src/data/showcases.ts must have an entry.
 */
export const SHOWCASE_COMPONENTS: Record<string, ComponentType> = {
  kiln: KilnShowcase,
  torque: TorqueShowcase,
  undertow: UndertowShowcase,
  datum: DatumShowcase,
  tandem: TandemShowcase,
};
