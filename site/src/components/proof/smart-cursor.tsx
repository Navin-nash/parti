"use client";

import { useSyncExternalStore } from "react";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

/**
 * SmoothCursor, gated. It hides the OS pointer, so it only mounts where that is
 * safe and wanted: a fine pointer (mouse, not touch), a wide viewport, and no
 * reduced-motion preference. Touch and keyboard users keep their normal cursor.
 */
function getSnapshot() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const wide = window.matchMedia("(min-width: 1024px)").matches;
  const calm = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return fine && wide && calm;
}

function getServerSnapshot() {
  return false;
}

function subscribe(onChange: () => void) {
  const queries = [
    window.matchMedia("(pointer: fine)"),
    window.matchMedia("(min-width: 1024px)"),
    window.matchMedia("(prefers-reduced-motion: reduce)"),
  ];
  queries.forEach((q) => q.addEventListener?.("change", onChange));
  return () => {
    queries.forEach((q) => q.removeEventListener?.("change", onChange));
  };
}

export function SmartCursor() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return on ? <SmoothCursor /> : null;
}
