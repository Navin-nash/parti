"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { cn } from "@/lib/utils";
import type { Showcase } from "@/data/showcases";

/**
 * A folder that springs open on click and fans its contents out as photo
 * cards - the exact chrome of @alexperezcedeno's Interactive Folder Gallery
 * (21st.dev): dark gradient folder body, glossy rounded cards, drop shadows.
 * Requested faithfully rather than adapted to this site's own radius-0
 * material - see DESIGN.md's third exception. The mechanism (spring-open,
 * fan, drag-down-to-close) and the chrome are both kept as-is; the only real
 * change is what fills each card - a real screenshot of the showcase it
 * links to (`public/gallery/<slug>.png`, captured from the live `/preview`
 * route), not a stock photo standing in for one.
 */
export interface FolderGalleryProps {
  items: Showcase[];
  folderName?: string;
  dragHintText?: string;
  className?: string;
}

export function FolderGallery({
  items,
  folderName = "Gallery.showcase",
  dragHintText = "Drag any page down to close",
  className,
}: FolderGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const reduceMotion = useReducedMotion();

  const close = () => {
    setIsOpen(false);
    setHover(false);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100) close();
  };

  return (
    <div className={cn("relative w-full py-16", className)}>
      <div className="relative flex min-h-[480px] w-full flex-col items-center justify-center">
        <div className="relative flex h-[480px] w-full max-w-[400px] justify-center">
          {/* folder body, behind everything, fades out once opened */}
          <motion.div
            className="absolute bottom-6 h-56 w-80 drop-shadow-2xl"
            animate={{ opacity: isOpen ? 0 : 1, scale: isOpen ? 0.9 : 1 }}
          >
            <div className="absolute left-0 top-0 h-10 w-32 rounded-t-[12px] border-l border-r border-t border-white/10 bg-linear-to-t from-[#1e1e1e] to-[#2a2a2a]" />
            <div className="absolute bottom-0 left-0 right-0 top-8 rounded-b-[12px] rounded-tr-[12px] border border-white/10 bg-linear-to-b from-[#1e1e1e] to-[#0a0a0a] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
            <div className="pointer-events-none absolute bottom-2 left-2 right-2 top-10 rounded-[8px] bg-black shadow-inner" />
          </motion.div>

          {/* fanned pages */}
          <div className="absolute bottom-10 z-10 flex justify-center">
            {items.map((item, i) => {
              const offset = i - (items.length - 1) / 2;
              const stackY = hover ? offset * -10 - 40 : offset * -5;
              const stackX = hover ? offset * 30 : offset * 3;
              const stackRotate = hover ? offset * 8 : offset * 3;
              const stackScale = 1 - Math.abs(offset) * 0.03;

              const openX = offset * 130;
              const state = reduceMotion
                ? { y: isOpen ? -130 : stackY, x: isOpen ? openX : stackX, rotate: 0, scale: 1, zIndex: isOpen ? 50 : i + 10 }
                : isOpen
                  ? { y: -130, x: openX, rotate: 0, scale: 1.05, zIndex: 50 }
                  : { y: stackY, x: stackX, rotate: stackRotate, scale: stackScale, zIndex: i + 10 };

              return (
                <motion.a
                  key={item.slug}
                  href={`/gallery/${item.slug}`}
                  drag={isOpen && !reduceMotion}
                  dragSnapToOrigin
                  onDragEnd={handleDragEnd}
                  onClick={(e) => {
                    if (!isOpen) e.preventDefault();
                  }}
                  className={cn(
                    "absolute bottom-0 h-72 w-56 origin-bottom overflow-hidden rounded-[12px] border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.5)]",
                    isOpen ? "cursor-grab pointer-events-auto active:cursor-grabbing" : "pointer-events-none",
                  )}
                  animate={state}
                  whileHover={isOpen ? { scale: 1.1, zIndex: 100 } : {}}
                  whileTap={isOpen ? { scale: 1.02 } : {}}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  aria-label={isOpen ? `Open ${item.title} in the gallery` : undefined}
                  tabIndex={isOpen ? 0 : -1}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- a
                      real captured screenshot, not an optimizable remote asset */}
                  <img
                    src={`/gallery/${item.slug}.png`}
                    alt={`${item.title}, live`}
                    className="pointer-events-none h-full w-full object-cover object-top"
                  />
                </motion.a>
              );
            })}
          </div>

          {/* folder front + tab, the click target */}
          <motion.button
            type="button"
            className="absolute bottom-0 z-20 h-44 w-[340px] cursor-pointer"
            style={{ transformOrigin: "bottom" }}
            animate={{ opacity: isOpen ? 0 : 1, rotateX: hover ? -25 : 0, y: hover ? 10 : 0, pointerEvents: isOpen ? "none" : "auto" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            onClick={() => setIsOpen(true)}
            aria-expanded={isOpen}
            aria-label={`Open the ${folderName} folder`}
          >
            <div className="relative flex h-full w-full flex-col items-center justify-end overflow-hidden rounded-[16px] border border-white/20 bg-linear-to-b from-[#2a2a2a] to-[#111] pb-8 shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]">
              <div className="absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent" />
              <div className="flex items-center justify-center rounded-[8px] border border-black/80 bg-black px-5 py-2.5 shadow-inner backdrop-blur-md">
                <span className="text-sm font-medium tracking-wide text-white/90">{folderName}</span>
              </div>
            </div>
          </motion.button>
        </div>

        <motion.p
          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 50 }}
          className="pointer-events-none absolute bottom-6 rounded-full border border-black/10 bg-black/5 px-6 py-3 text-sm font-medium uppercase tracking-widest text-black/50 backdrop-blur-md"
        >
          {dragHintText}
        </motion.p>
      </div>
    </div>
  );
}
