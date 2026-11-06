import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { m, useInView, useReducedMotion, type Variants } from 'motion/react';
import type { Dictionary } from '@/i18n/es';

export type VisualLabels = Dictionary['story']['visuals'];
export type Orientation = 'horizontal' | 'vertical';

export interface VisualProps {
  labels: VisualLabels;
  /** "vertical" is the compact mobile layout (top to bottom). */
  orientation: Orientation;
  /** True when mounted after hydration (e.g. the desktop panel switching visuals). */
  startHidden: boolean;
}

/**
 * "static": server render, no JS yet, or reduced motion. Everything is drawn in its final state.
 * "hidden": hydrated but not yet in view; reset to the start of the animation (off screen).
 * "play":   in view; animate to the final state and run ambient loops.
 */
export type Phase = 'static' | 'hidden' | 'play';

export function usePlayback(startHidden: boolean): { ref: RefObject<SVGSVGElement | null>; phase: Phase } {
  const ref = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(startHidden);
  useEffect(() => setMounted(true), []);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const phase: Phase = !mounted || reduced ? 'static' : inView ? 'play' : 'hidden';
  return { ref, phase };
}

const instant = { duration: 0 };
const delayOf = (i: unknown) => (typeof i === 'number' ? i : 0) * 0.12;

/** Variants are keyed "hidden" / "show"; the root <svg> picks one, children inherit it. */
export const fade: Variants = {
  hidden: { opacity: 0, transition: instant },
  show: (i: unknown) => ({ opacity: 1, transition: { delay: delayOf(i), duration: 0.45 } }),
};

export const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0, transition: instant },
  show: (i: unknown) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay: delayOf(i), duration: 0.6, ease: 'easeInOut' },
  }),
};

export const growX: Variants = {
  hidden: { scaleX: 0, transition: instant },
  show: (i: unknown) => ({ scaleX: 1, transition: { delay: delayOf(i), duration: 0.8, ease: 'easeOut' } }),
};

export const growY: Variants = {
  hidden: { scaleY: 0, transition: instant },
  show: (i: unknown) => ({ scaleY: 1, transition: { delay: delayOf(i), duration: 0.6, ease: 'easeOut' } }),
};

/** Screens that "power on": dim until lit. */
export const light: Variants = {
  hidden: { opacity: 0.2, transition: instant },
  show: (i: unknown) => ({ opacity: 1, transition: { delay: delayOf(i), duration: 0.35 } }),
};

/** Infinite blink, only while playing; static otherwise. */
export function blink(phase: Phase, delay = 0) {
  return phase === 'play'
    ? { animate: { opacity: [1, 0.2, 1] }, transition: { duration: 1.4, repeat: Infinity, delay } }
    : {};
}

interface FrameProps {
  width: number;
  height: number;
  label: string;
  phase: Phase;
  svgRef: RefObject<SVGSVGElement | null>;
  children: ReactNode;
}

/** Root <svg>: reserved aspect ratio (no CLS), accessible name, variant driver. */
export function Frame({ width, height, label, phase, svgRef, children }: FrameProps) {
  return (
    <m.svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className="block h-auto max-h-[220px] w-full font-mono text-fg lg:max-h-none"
      style={{ aspectRatio: `${width} / ${height}` }}
      fill="none"
      initial={false}
      animate={phase === 'hidden' ? 'hidden' : 'show'}
    >
      {children}
    </m.svg>
  );
}

/** Splits a label into lines of at most `max` characters, on word boundaries. */
export function wrap(text: string, max: number): string[] {
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines.at(-1);
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

/** Builds an SVG path through normalized points (0..1, y up) inside a box. */
export function linePath(points: readonly number[], x: number, y: number, w: number, h: number): string {
  const step = w / (points.length - 1);
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${(x + i * step).toFixed(1)} ${(y + h - p * h).toFixed(1)}`).join(' ');
}
