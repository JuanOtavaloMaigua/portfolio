import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from 'react';
import {
  EDGES,
  INDUSTRIES,
  NETWORK_LAYOUTS,
  STACKS,
  TECHS,
  TECH_IDS,
  industriesOf,
  type IndustryId,
  type LabelSide,
  type LayoutKey,
  type NetworkLayout,
  type TechId,
} from '@/data/network';
import type { Dictionary } from '@/i18n/es';

export type NetworkLabels = Dictionary['hero']['network'];

interface Props {
  labels: NetworkLabels;
  /** Story URL per industry, already localized (e.g. food -> /trabajo/caiheng/). */
  storyHrefs: Partial<Record<IndustryId, string>>;
}

type Selection = { kind: 'industry'; id: IndustryId } | { kind: 'tech'; id: TechId } | null;

/**
 * "static":   server render, no JS yet, or reduced motion. Final state, no motion.
 * "hidden":   hydrated while off screen; reset so it can assemble when it scrolls in.
 * "assemble": industries fade in, then edges draw to their technologies (~1.2s).
 * "trace":    hydrated while already on screen; a wave of pulses runs over the visible graph
 *             instead of hiding it (no flash of content).
 * "live":     idle floating and occasional pulses.
 */
type Phase = 'static' | 'hidden' | 'assemble' | 'trace' | 'live';

/** Tablet and desktop only; phones (< 640px) get MobileProductNetwork instead (see Hero.astro). */
const LAYOUT_KEYS: readonly LayoutKey[] = ['tablet', 'desktop'];
/** Must match the breakpoint that swaps .net-tablet for .net-desktop in global.css. */
const DESKTOP_QUERY = '(min-width: 1024px)';
const ASSEMBLE_MS = 1300;
const TRACE_MS = 1500;
const FLOAT_AMPLITUDE = 3;
const PULSE_MS = 1300;
const MAX_IDLE_PULSES = 3;

const industryDelay = (i: number) => i * 0.08;
const edgeDelay = (k: number) => 0.35 + k * 0.03;
/** A technology appears once the first edge reaching it is half drawn. */
const techDelay = (tech: TechId) => edgeDelay(EDGES.findIndex((edge) => edge.tech === tech)) + 0.2;

/** Rough text width for Inter semibold; pills only need to be close, not exact. */
const pillWidth = (label: string, font: number) => Math.max(label.length * font * 0.52 + font * 1.9, font * 3.6);
const pillHeight = (font: number) => font * 2.2;

function labelProps(side: LabelSide, font: number) {
  const gap = 9;
  switch (side) {
    case 'top':
      return { x: 0, y: -gap, textAnchor: 'middle' as const };
    case 'bottom':
      return { x: 0, y: gap + font * 0.75, textAnchor: 'middle' as const };
    case 'left':
      return { x: -gap, y: font * 0.36, textAnchor: 'end' as const };
    case 'right':
      return { x: gap, y: font * 0.36, textAnchor: 'start' as const };
  }
}

const nodeKey = (kind: 'i' | 't', id: string) => `${kind}:${id}`;

function pointOf(layout: NetworkLayout, key: string) {
  const [kind, id] = key.split(':') as ['i' | 't', string];
  return kind === 'i' ? layout.industries[id as IndustryId] : layout.techs[id as TechId];
}

/** Deterministic per-node float parameters (no Math.random, so every visit looks the same). */
function floatParams(index: number) {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const r = seed - Math.floor(seed);
  return { px: r * Math.PI * 2, py: (1 - r) * Math.PI * 2, wx: 0.00085 + r * 0.0004, wy: 0.0007 + (1 - r) * 0.0004 };
}

interface Refs {
  nodes: Map<string, SVGGElement>;
  edges: (SVGPathElement | null)[];
  pulses: (SVGCircleElement | null)[];
}

function emptyRefs(): Refs {
  return { nodes: new Map(), edges: [], pulses: [] };
}

function highlight(selection: Selection) {
  if (selection === null) return null;
  if (selection.kind === 'industry') {
    return {
      industries: new Set<IndustryId>([selection.id]),
      techs: new Set<TechId>(STACKS[selection.id]),
      edges: new Set(EDGES.flatMap((edge, k) => (edge.industry === selection.id ? [k] : []))),
    };
  }
  return {
    industries: new Set<IndustryId>(industriesOf(selection.id)),
    techs: new Set<TechId>([selection.id]),
    edges: new Set(EDGES.flatMap((edge, k) => (edge.tech === selection.id ? [k] : []))),
  };
}

export default function IndustryNetwork({ labels, storyHrefs }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<LayoutKey, Refs>>({ tablet: emptyRefs(), desktop: emptyRefs() });
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('static');
  const [pinned, setPinned] = useState<Selection>(null);
  const [hovered, setHovered] = useState<Selection>(null);
  const active = hovered ?? pinned;
  const lit = useMemo(() => highlight(active), [active]);
  const litEdgesRef = useRef<number[]>([]);
  litEdgesRef.current = lit ? [...lit.edges] : [];

  // Decide the entry animation once, after hydration.
  useEffect(() => {
    setMounted(true);
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const box = root.getBoundingClientRect();
    const onScreen = box.top < window.innerHeight && box.bottom > 0;
    if (onScreen) {
      setPhase('trace');
      const timer = window.setTimeout(() => setPhase('live'), TRACE_MS);
      return () => window.clearTimeout(timer);
    }

    setPhase('hidden');
    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        setPhase('assemble');
        timer = window.setTimeout(() => setPhase('live'), ASSEMBLE_MS);
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const animating = phase === 'trace' || phase === 'live';
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  // Floating nodes + pulses: one rAF loop that writes attributes directly (no React renders).
  useEffect(() => {
    const root = rootRef.current;
    if (!animating || !root) return;

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    const keys = new Map<LayoutKey, string[]>(
      LAYOUT_KEYS.map((layoutKey) => [layoutKey, [...refs.current[layoutKey].nodes.keys()]]),
    );
    const params = new Map<string, ReturnType<typeof floatParams>>();
    [...(keys.get('tablet') ?? [])].forEach((key, i) => params.set(key, floatParams(i + 1)));

    interface Pulse {
      edge: number;
      start: number;
      reverse: boolean;
    }
    const pulses: Pulse[] = [];
    const start = performance.now();
    let nextSpawn = start + 600;
    if (phaseRef.current === 'trace') {
      EDGES.forEach((_, k) => pulses.push({ edge: k, start: start + 150 + k * 45, reverse: false }));
      nextSpawn = start + TRACE_MS + 400;
    }

    let raf = 0;
    let visible = true;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const layoutKey: LayoutKey = desktopQuery.matches ? 'desktop' : 'tablet';
      const layout = NETWORK_LAYOUTS[layoutKey];
      const store = refs.current[layoutKey];
      const ramp = Math.min(1, (now - start) / 1500);
      const amp = FLOAT_AMPLITUDE * ramp;
      const offsets = new Map<string, { x: number; y: number }>();

      for (const key of keys.get(layoutKey) ?? []) {
        const p = params.get(key) ?? floatParams(0);
        const dx = Math.sin(now * p.wx + p.px) * amp;
        const dy = Math.cos(now * p.wy + p.py) * amp;
        offsets.set(key, { x: dx, y: dy });
        store.nodes.get(key)?.setAttribute('transform', `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
      }

      const ends = (k: number) => {
        const edge = EDGES[k];
        if (!edge) return null;
        const a = nodeKey('i', edge.industry);
        const b = nodeKey('t', edge.tech);
        const pa = pointOf(layout, a);
        const pb = pointOf(layout, b);
        const oa = offsets.get(a) ?? { x: 0, y: 0 };
        const ob = offsets.get(b) ?? { x: 0, y: 0 };
        return { x1: pa.x + oa.x, y1: pa.y + oa.y, x2: pb.x + ob.x, y2: pb.y + ob.y };
      };

      store.edges.forEach((path, k) => {
        const e = ends(k);
        if (path && e) path.setAttribute('d', `M${e.x1.toFixed(2)} ${e.y1.toFixed(2)}L${e.x2.toFixed(2)} ${e.y2.toFixed(2)}`);
      });

      if (now >= nextSpawn && pulses.length < MAX_IDLE_PULSES) {
        const pool = litEdgesRef.current.length > 0 ? litEdgesRef.current : EDGES.map((_, k) => k);
        const edge = pool[Math.floor(Math.random() * pool.length)] ?? 0;
        pulses.push({ edge, start: now, reverse: Math.random() < 0.35 });
        nextSpawn = now + 700 + Math.random() * 1100;
      }

      store.pulses.forEach((circle) => circle?.setAttribute('opacity', '0'));
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (!pulse) continue;
        const t = (now - pulse.start) / PULSE_MS;
        if (t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const circle = store.pulses[i];
        const e = ends(pulse.edge);
        if (t < 0 || !circle || !e) continue;
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        const f = pulse.reverse ? 1 - eased : eased;
        circle.setAttribute('cx', (e.x1 + (e.x2 - e.x1) * f).toFixed(2));
        circle.setAttribute('cy', (e.y1 + (e.y2 - e.y1) * f).toFixed(2));
        circle.setAttribute('opacity', Math.sin(Math.PI * t).toFixed(2));
      }

      raf = requestAnimationFrame(frame);
    };

    const resume = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      resume();
    });
    observer.observe(root);
    document.addEventListener('visibilitychange', resume);
    resume();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', resume);
      if (raf) cancelAnimationFrame(raf);
    };
    // Runs across trace -> live without restarting, so floating never jumps.
  }, [animating]);

  // Tap/click anywhere outside the network clears the pinned selection.
  useEffect(() => {
    if (pinned === null) return;
    const onDocClick = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setPinned(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [pinned]);

  const same = (a: Selection, b: Selection) => a !== null && b !== null && a.kind === b.kind && a.id === b.id;

  const toggle = useCallback((next: Selection) => {
    setPinned((current) => (same(current, next) ? null : next));
  }, []);

  const hoverProps = (selection: Selection) => ({
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHovered(selection);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === 'mouse') setHovered(null);
    },
  });

  const onSvgClick = (event: MouseEvent<SVGSVGElement>) => {
    if (!(event.target as Element).closest('[data-node]')) setPinned(null);
  };

  const industryAria = (id: IndustryId) => `${labels.industries[id]}: ${STACKS[id].map((tech) => TECHS[tech]).join(', ')}`;

  const renderLayout = (layoutKey: LayoutKey) => {
    const layout = NETWORK_LAYOUTS[layoutKey];
    const store = refs.current[layoutKey];
    const { industryFont: fi, techFont: ft } = layout;

    return (
      <svg
        key={layoutKey}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className={`net-svg net-${layoutKey}`}
        style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
        role="group"
        aria-label={labels.aria}
        onClick={onSvgClick}
      >
        <g aria-hidden="true">
          {EDGES.map((edge, k) => {
            const a = layout.industries[edge.industry];
            const b = layout.techs[edge.tech];
            return (
              <path
                key={`${edge.industry}-${edge.tech}`}
                ref={(el) => {
                  store.edges[k] = el;
                }}
                className={`net-edge${lit?.edges.has(k) ? ' is-on' : ''}`}
                d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
                pathLength={1}
                style={{ '--d': `${edgeDelay(k)}s` } as React.CSSProperties}
              />
            );
          })}
          {EDGES.map((edge, k) => (
            <circle
              key={`p-${edge.industry}-${edge.tech}`}
              ref={(el) => {
                store.pulses[k] = el;
              }}
              className="net-pulse"
              r={2.8}
              cx={-10}
              cy={-10}
              opacity={0}
            />
          ))}
        </g>

        {TECH_IDS.map((tech) => {
          const point = layout.techs[tech];
          const selection: Selection = { kind: 'tech', id: tech };
          const on = lit?.techs.has(tech) ?? false;
          return (
            <g
              key={tech}
              data-node
              aria-hidden="true"
              className={`net-node net-tech${on ? ' is-on' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => toggle(selection)}
              {...hoverProps(selection)}
            >
              <g className="net-body" style={{ '--d': `${techDelay(tech)}s` } as React.CSSProperties}>
                <g
                  ref={(el) => {
                    if (el) store.nodes.set(nodeKey('t', tech), el);
                  }}
                >
                  <circle className="net-hit" r={14} />
                  <circle className="net-dot" r={4} />
                  <text className="net-tech-label" fontSize={ft} {...labelProps(point.label, ft)}>
                    {TECHS[tech]}
                  </text>
                </g>
              </g>
            </g>
          );
        })}

        {INDUSTRIES.map((industry, i) => {
          const point = layout.industries[industry];
          const label = labels.industries[industry];
          const w = pillWidth(label, fi);
          const h = pillHeight(fi);
          const selection: Selection = { kind: 'industry', id: industry };
          const on = lit?.industries.has(industry) ?? false;
          const pressed = same(pinned, selection);
          return (
            <g
              key={industry}
              data-node
              className={`net-node net-ind${on ? ' is-on' : ''}`}
              transform={`translate(${point.x} ${point.y})`}
              onClick={() => toggle(selection)}
              {...hoverProps(selection)}
              {...(mounted
                ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-pressed': pressed,
                    'aria-label': industryAria(industry),
                    onKeyDown: (event: KeyboardEvent) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggle(selection);
                      }
                    },
                  }
                : { 'aria-label': industryAria(industry) })}
            >
              <g className="net-body" style={{ '--d': `${industryDelay(i)}s` } as React.CSSProperties}>
                <g
                  ref={(el) => {
                    if (el) store.nodes.set(nodeKey('i', industry), el);
                  }}
                >
                  <rect className="net-ring" x={-w / 2 - 4} y={-h / 2 - 4} width={w + 8} height={h + 8} rx={h / 2 + 4} />
                  <rect className="net-pill" x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} />
                  <text className="net-ind-label" fontSize={fi} y={fi * 0.36} textAnchor="middle">
                    {label}
                  </text>
                </g>
              </g>
            </g>
          );
        })}
      </svg>
    );
  };

  const story = active?.kind === 'industry' ? storyHrefs[active.id] : undefined;

  return (
    <div ref={rootRef} className="net" data-phase={phase} data-active={active ? '' : undefined}>
      {LAYOUT_KEYS.map(renderLayout)}
      <p className="net-caption" aria-live="polite">
        {active === null ? (
          mounted ? labels.hint : labels.summary
        ) : (
          <>
            <strong className="font-semibold text-fg">
              {active.kind === 'industry' ? labels.industries[active.id] : TECHS[active.id]}
            </strong>
            {' · '}
            {active.kind === 'industry'
              ? STACKS[active.id].map((tech) => TECHS[tech]).join(', ')
              : industriesOf(active.id)
                  .map((industry) => labels.industries[industry])
                  .join(', ')}
            {story && (
              <>
                {' · '}
                <a className="link font-medium" href={story}>
                  {labels.storyLink} <span aria-hidden="true">→</span>
                </a>
              </>
            )}
          </>
        )}
      </p>
    </div>
  );
}
