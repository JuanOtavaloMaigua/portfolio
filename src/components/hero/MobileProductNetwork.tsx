import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { PRODUCT_IDS, PRODUCT_LAYOUT, PRODUCT_LINKS, productNeighbors, type ProductId } from '@/data/network';
import type { NetworkLabels } from '@/components/hero/IndustryNetwork';

interface Props {
  labels: NetworkLabels;
  /** Story URL per product, already localized (e.g. dashboards -> /trabajo/caiheng/). */
  storyHrefs: Partial<Record<ProductId, string>>;
}

/**
 * Same phases as IndustryNetwork:
 * "static":   server render, no JS yet, or reduced motion. Final state, no motion.
 * "hidden":   hydrated while off screen; reset so it can assemble when it scrolls in.
 * "assemble": products pop in from the ERP outwards while the links draw (~1.2s).
 * "trace":    hydrated while already on screen; a wave of pulses runs over the visible graph (no flash).
 * "live":     idle floating and occasional pulses.
 */
type Phase = 'static' | 'hidden' | 'assemble' | 'trace' | 'live';

const L = PRODUCT_LAYOUT;
const ASSEMBLE_MS = 1300;
const TRACE_MS = 1500;
/** Float amplitude in CSS px. Small enough that links never reach a pill they do not connect. */
const FLOAT_AMPLITUDE = 2.5;
const PULSE_MS = 1400;
const MAX_IDLE_PULSES = 2;

/** Assemble order: the ERP first, then products by distance from it. */
const ORDER = [...PRODUCT_IDS].sort((a, b) => {
  const d = (id: ProductId) => Math.hypot(L.nodes[id].x - L.nodes.erp.x, L.nodes[id].y - L.nodes.erp.y);
  return d(a) - d(b);
});
const nodeDelay = (id: ProductId) => ORDER.indexOf(id) * 0.07;
const linkDelay = (k: number) => {
  const [a, b] = PRODUCT_LINKS[k] ?? ['erp', 'erp'];
  return Math.min(nodeDelay(a), nodeDelay(b)) + 0.12;
};

/** Deterministic per-node float parameters (no Math.random, so every visit looks the same). */
function floatParams(index: number) {
  const seed = Math.sin(index * 12.9898) * 43758.5453;
  const r = seed - Math.floor(seed);
  return { px: r * Math.PI * 2, py: (1 - r) * Math.PI * 2, wx: 0.0008 + r * 0.0004, wy: 0.00065 + (1 - r) * 0.0004 };
}

const pct = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

export default function MobileProductNetwork({ labels, storyHrefs }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef(new Map<ProductId, HTMLElement>());
  const linkRefs = useRef<(SVGPathElement | null)[]>([]);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>('static');
  const [selected, setSelected] = useState<ProductId | null>(null);
  /** The caption is only announced after the user picks a product, never on load. */
  const [announce, setAnnounce] = useState(false);

  const lit = useMemo(() => {
    if (selected === null) return null;
    return {
      nodes: new Set<ProductId>([selected, ...productNeighbors(selected)]),
      links: new Set(PRODUCT_LINKS.flatMap(([a, b], k) => (a === selected || b === selected ? [k] : []))),
    };
  }, [selected]);
  const litLinksRef = useRef<number[]>([]);
  litLinksRef.current = lit ? [...lit.links] : [];

  // Decide the entry animation once, after hydration.
  useEffect(() => {
    setMounted(true);
    const root = rootRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const box = root.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) {
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

  // Floating pills + pulses: one rAF loop that writes styles/attributes directly (no React renders).
  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!animating || !root || !stage) return;

    /** CSS px per viewBox unit; pills float in px, links are drawn in viewBox units. */
    let scale = stage.clientWidth / L.width || 1;
    const resize = new ResizeObserver(() => {
      scale = stage.clientWidth / L.width || 1;
    });
    resize.observe(stage);

    const params = new Map(PRODUCT_IDS.map((id, i) => [id, floatParams(i + 1)]));
    interface Pulse {
      link: number;
      start: number;
      reverse: boolean;
    }
    const pulses: Pulse[] = [];
    const start = performance.now();
    let nextSpawn = start + 900;
    if (phaseRef.current === 'trace') {
      PRODUCT_LINKS.forEach((_, k) => pulses.push({ link: k, start: start + 150 + k * 60, reverse: false }));
      nextSpawn = start + TRACE_MS + 600;
    }

    let raf = 0;
    let visible = true;

    const frame = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const amp = FLOAT_AMPLITUDE * Math.min(1, (now - start) / 1500);
      const at = new Map<ProductId, { x: number; y: number }>();

      for (const id of PRODUCT_IDS) {
        const p = params.get(id) ?? floatParams(0);
        const dx = Math.sin(now * p.wx + p.px) * amp;
        const dy = Math.cos(now * p.wy + p.py) * amp;
        pillRefs.current.get(id)?.style.setProperty('transform', `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`);
        const base = L.nodes[id];
        at.set(id, { x: base.x + dx / scale, y: base.y + dy / scale });
      }

      const ends = (k: number) => {
        const link = PRODUCT_LINKS[k];
        if (!link) return null;
        const a = at.get(link[0]);
        const b = at.get(link[1]);
        return a && b ? { x1: a.x, y1: a.y, x2: b.x, y2: b.y } : null;
      };

      linkRefs.current.forEach((path, k) => {
        const e = ends(k);
        if (path && e) path.setAttribute('d', `M${e.x1.toFixed(2)} ${e.y1.toFixed(2)}L${e.x2.toFixed(2)} ${e.y2.toFixed(2)}`);
      });

      if (now >= nextSpawn && pulses.length < MAX_IDLE_PULSES) {
        const pool = litLinksRef.current.length > 0 ? litLinksRef.current : PRODUCT_LINKS.map((_, k) => k);
        const link = pool[Math.floor(Math.random() * pool.length)] ?? 0;
        pulses.push({ link, start: now, reverse: Math.random() < 0.5 });
        nextSpawn = now + 1100 + Math.random() * 1400;
      }

      pulseRefs.current.forEach((circle) => circle?.setAttribute('opacity', '0'));
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        if (!pulse) continue;
        const t = (now - pulse.start) / PULSE_MS;
        if (t >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const circle = pulseRefs.current[i];
        const e = ends(pulse.link);
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
      resize.disconnect();
      document.removeEventListener('visibilitychange', resume);
      if (raf) cancelAnimationFrame(raf);
    };
    // Runs across trace -> live without restarting, so floating never jumps.
  }, [animating]);

  // Tap/click anywhere outside the network clears the selection.
  useEffect(() => {
    if (selected === null) return;
    const onDocClick = (event: globalThis.MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setSelected(null);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [selected]);

  const toggle = useCallback((id: ProductId) => {
    setAnnounce(true);
    setSelected((current) => (current === id ? null : id));
  }, []);

  // A tap on the empty stage (not on a pill) clears too.
  const onStageClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target as Element).closest('.pnet-pill')) setSelected(null);
  };

  const text = selected ? labels.products[selected] : null;
  const story = selected ? storyHrefs[selected] : undefined;

  return (
    <div ref={rootRef} className="pnet" data-phase={phase} data-active={selected ? '' : undefined}>
      <div
        ref={stageRef}
        className="pnet-stage"
        style={{ aspectRatio: `${L.width} / ${L.height}` }}
        onClick={onStageClick}
      >
        <svg viewBox={`0 0 ${L.width} ${L.height}`} className="pnet-svg" aria-hidden="true" focusable="false">
          {PRODUCT_LINKS.map(([a, b], k) => {
            const pa = L.nodes[a];
            const pb = L.nodes[b];
            return (
              <path
                key={`${a}-${b}`}
                ref={(el) => {
                  linkRefs.current[k] = el;
                }}
                className={`pnet-link${lit?.links.has(k) ? ' is-on' : ''}`}
                d={`M${pa.x} ${pa.y}L${pb.x} ${pb.y}`}
                pathLength={1}
                style={{ '--d': `${linkDelay(k)}s` } as CSSProperties}
              />
            );
          })}
          {PRODUCT_LINKS.map(([a, b], k) => (
            <circle
              key={`p-${a}-${b}`}
              ref={(el) => {
                pulseRefs.current[k] = el;
              }}
              className="pnet-pulse"
              r={2.6}
              cx={-10}
              cy={-10}
              opacity={0}
            />
          ))}
        </svg>

        <div className="pnet-nodes" role="group" aria-label={labels.productsAria}>
          {PRODUCT_IDS.map((id) => {
            const point = L.nodes[id];
            const on = lit?.nodes.has(id) ?? false;
            const classes = `pnet-node${id === 'erp' ? ' is-main' : ''}${on ? ' is-on' : ''}${selected === id ? ' is-sel' : ''}`;
            const setRef = (el: HTMLElement | null) => {
              if (el) pillRefs.current.set(id, el);
              else pillRefs.current.delete(id);
            };
            return (
              <div
                key={id}
                className={classes}
                style={{ left: pct(point.x, L.width), top: pct(point.y, L.height), '--d': `${nodeDelay(id)}s` } as CSSProperties}
              >
                <div className="pnet-body">
                  {mounted ? (
                    <button
                      ref={setRef}
                      type="button"
                      className="pnet-pill"
                      aria-pressed={selected === id}
                      onClick={() => toggle(id)}
                    >
                      {labels.products[id].name}
                    </button>
                  ) : (
                    <span ref={setRef} className="pnet-pill">
                      {labels.products[id].name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pnet-card">
        <p aria-live={announce ? 'polite' : 'off'}>
        {text ? (
          <>
            <strong className="font-semibold text-fg">{text.name}</strong>
            <span aria-hidden="true">{' · '}</span>
            <span className="sr-only">{': '}</span>
            {text.description}
            {story && (
              <>
                {' '}
                <a className="link font-medium whitespace-nowrap" href={story}>
                  {labels.storyLink} <span aria-hidden="true">→</span>
                </a>
              </>
            )}
          </>
        ) : mounted ? (
          labels.productsHint
        ) : (
          labels.productsSummary
        )}
        </p>
      </div>
    </div>
  );
}
