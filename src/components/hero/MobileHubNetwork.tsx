import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { HUBS, HUB_LAYOUT, TECHS, hubPoints, type IndustryId } from '@/data/network';
import type { NetworkLabels } from '@/components/hero/IndustryNetwork';

interface Props {
  labels: NetworkLabels;
  /** Story URL per industry, already localized (e.g. food -> /trabajo/caiheng/). */
  storyHrefs: Partial<Record<IndustryId, string>>;
}

/** Time each project stays on screen while auto-cycling. */
const CYCLE_MS = 4000;
/** Outgoing technologies collapse into the hub before the next set radiates out (matches global.css). */
const OUT_MS = 260;
/** Auto-cycling waits this long after the last tap before it resumes. */
const TOUCH_PAUSE_MS = 8000;

const L = HUB_LAYOUT;
const PILL_H = L.techFont * 2.3;
/** Rough text widths (JetBrains Mono ~0.6em, Inter semibold ~0.56em); pills only need to be close. */
const techPillWidth = (label: string) => label.length * L.techFont * 0.6 + 22;
const nameWidth = (line: string) => line.length * L.nameFont * 0.56;
const eyebrowWidth = (label: string) => label.length * L.eyebrowFont * 0.66;

/** Long project names break at the space closest to the middle. */
function nameLines(name: string): string[] {
  if (name.length <= 18) return [name];
  const mid = name.length / 2;
  let best = -1;
  for (let i = 0; i < name.length; i++) {
    if (name[i] === ' ' && (best < 0 || Math.abs(i - mid) < Math.abs(best - mid))) best = i;
  }
  return best < 0 ? [name] : [name.slice(0, best), name.slice(best + 1)];
}

export default function MobileHubNetwork({ labels, storyHrefs }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [index, setIndex] = useState(0);
  /** Bumped on every swap; sets rendered after the first one radiate out of the hub. */
  const [generation, setGeneration] = useState(0);
  const [leaving, setLeaving] = useState(false);
  /** Caption announcements only follow the user's own actions, never the auto-cycle. */
  const [announce, setAnnounce] = useState(false);

  const indexRef = useRef(index);
  indexRef.current = index;
  const swapTimer = useRef(0);
  const visibleRef = useRef(true);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const pauseUntil = useRef(0);

  const hub = HUBS[index] ?? HUBS[0]!;
  const text = labels.hubs[hub.id];
  const points = useMemo(() => hubPoints(hub.techs.length), [hub]);
  const story = storyHrefs[hub.industry];

  // The hub keeps one size for every project so it never jumps: the widest name/eyebrow in this locale.
  const hubBox = useMemo(() => {
    const widest = Math.max(
      ...HUBS.flatMap((h) => [...nameLines(labels.hubs[h.id].name).map(nameWidth), eyebrowWidth(labels.hubs[h.id].industry)]),
    );
    const lines = Math.max(...HUBS.map((h) => nameLines(labels.hubs[h.id].name).length));
    return { w: Math.max(widest + 32, 132), h: 26 + L.eyebrowFont + 6 + lines * L.nameFont * 1.25 };
  }, [labels]);
  const lines = nameLines(text.name);

  useEffect(() => {
    setMounted(true);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);

    const root = rootRef.current;
    const observer = new IntersectionObserver((entries) => {
      visibleRef.current = entries.some((entry) => entry.isIntersecting);
    });
    if (root) observer.observe(root);
    return () => {
      query.removeEventListener('change', sync);
      observer.disconnect();
      window.clearTimeout(swapTimer.current);
    };
  }, []);

  const go = useCallback(
    (target: number) => {
      window.clearTimeout(swapTimer.current);
      const swap = () => {
        setIndex(target);
        setGeneration((g) => g + 1);
        setLeaving(false);
      };
      if (reduced) {
        swap();
        return;
      }
      setLeaving(true);
      swapTimer.current = window.setTimeout(swap, OUT_MS);
    },
    [reduced],
  );

  // Auto-cycle: re-armed after every swap; waits while off screen, in a hidden tab, or while the user is interacting.
  useEffect(() => {
    if (!mounted || reduced) return;
    let timer = 0;
    const blocked = () =>
      !visibleRef.current || document.hidden || hoverRef.current || focusRef.current || performance.now() < pauseUntil.current;
    const tick = () => {
      if (blocked()) {
        timer = window.setTimeout(tick, 1000);
        return;
      }
      setAnnounce(false);
      go((indexRef.current + 1) % HUBS.length);
    };
    timer = window.setTimeout(tick, CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [mounted, reduced, index, go]);

  const userGo = (target: number) => {
    pauseUntil.current = performance.now() + TOUCH_PAUSE_MS;
    setAnnounce(true);
    if (target !== indexRef.current || leaving) go(target);
  };
  const next = () => userGo((indexRef.current + 1) % HUBS.length);

  const onInteract = () => {
    pauseUntil.current = performance.now() + TOUCH_PAUSE_MS;
    setAnnounce(true);
  };

  const fill = (template: string, n: number, name: string) =>
    template.replace('{n}', String(n)).replace('{total}', String(HUBS.length)).replace('{name}', name);

  const isNew = generation > 0;
  const nameTop = -hubBox.h / 2 + 13 + L.eyebrowFont + 6 + (hubBox.h - 26 - L.eyebrowFont - 6 - lines.length * L.nameFont * 1.25) / 2;

  return (
    <div
      ref={rootRef}
      className="hub"
      data-state={leaving ? 'out' : 'in'}
      onPointerDown={onInteract}
      onKeyDown={onInteract}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') hoverRef.current = true;
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') hoverRef.current = false;
      }}
      onFocus={(event) => {
        focusRef.current = event.target.matches(':focus-visible');
      }}
      onBlur={() => {
        focusRef.current = false;
      }}
    >
      <svg
        viewBox={`0 0 ${L.width} ${L.height}`}
        className="hub-svg"
        style={{ aspectRatio: `${L.width} / ${L.height}` }}
        role="group"
        aria-label={labels.aria}
      >
        <ellipse className="hub-orbit" cx={L.cx} cy={L.cy} rx={L.rx} ry={L.ry} aria-hidden="true" />

        <g key={generation} className={`hub-set${isNew ? ' is-new' : ''}`} aria-hidden="true">
          {points.map((p, k) => (
            <path
              key={`s-${hub.techs[k]}`}
              className="hub-spoke"
              d={`M${L.cx} ${L.cy}L${p.x} ${p.y}`}
              pathLength={1}
              style={{ '--i': k } as CSSProperties}
            />
          ))}
          {hub.techs.map((tech, k) => {
            const p = points[k] ?? { x: L.cx, y: L.cy };
            const label = TECHS[tech];
            const w = techPillWidth(label);
            return (
              <g key={tech} transform={`translate(${p.x} ${p.y})`}>
                <g
                  className="hub-tech"
                  style={{ '--fx': `${L.cx - p.x}px`, '--fy': `${L.cy - p.y}px`, '--i': k } as CSSProperties}
                >
                  <rect className="hub-tech-pill" x={-w / 2} y={-PILL_H / 2} width={w} height={PILL_H} rx={PILL_H / 2} />
                  <text className="hub-tech-label" fontSize={L.techFont} y={L.techFont * 0.36} textAnchor="middle">
                    {label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        <g
          className="hub-core"
          transform={`translate(${L.cx} ${L.cy})`}
          {...(mounted
            ? {
                role: 'button',
                tabIndex: 0,
                'aria-label': `${labels.nextHub}: ${labels.hubs[HUBS[(index + 1) % HUBS.length]!.id].name}`,
                onClick: next,
                onKeyDown: (event: KeyboardEvent) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    next();
                  }
                },
              }
            : { 'aria-hidden': true })}
        >
          <rect
            key={`r-${generation}`}
            className={`hub-wave${isNew ? ' is-new' : ''}`}
            x={-hubBox.w / 2}
            y={-hubBox.h / 2}
            width={hubBox.w}
            height={hubBox.h}
            rx={18}
          />
          <rect className="hub-ring" x={-hubBox.w / 2 - 4} y={-hubBox.h / 2 - 4} width={hubBox.w + 8} height={hubBox.h + 8} rx={22} />
          <rect className="hub-pill" x={-hubBox.w / 2} y={-hubBox.h / 2} width={hubBox.w} height={hubBox.h} rx={18} />
          <g className="hub-label">
            <text className="hub-eyebrow" fontSize={L.eyebrowFont} y={-hubBox.h / 2 + 13 + L.eyebrowFont * 0.8} textAnchor="middle">
              {text.industry}
            </text>
            <text className="hub-name" fontSize={L.nameFont} textAnchor="middle">
              {lines.map((line, k) => (
                <tspan key={line} x={0} y={nameTop + L.nameFont * (0.95 + k * 1.25)}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        </g>
      </svg>

      <p className="hub-caption" aria-live={announce ? 'polite' : 'off'}>
        <strong className="font-semibold text-fg">{text.name}</strong>
        {' · '}
        {text.industry}
        <span className="sr-only">
          {': '}
          {hub.techs.map((tech) => TECHS[tech]).join(', ')}
        </span>
        {story && (
          <>
            {' · '}
            <a className="link font-medium" href={story}>
              {labels.storyLink} <span aria-hidden="true">→</span>
            </a>
          </>
        )}
      </p>

      <div className="hub-dots" role="group" aria-label={labels.hubsLabel}>
        {mounted &&
          HUBS.map((h, k) => (
            <button
              key={h.id}
              type="button"
              className="hub-dot"
              aria-label={fill(labels.hubAria, k + 1, labels.hubs[h.id].name)}
              aria-current={k === index ? 'true' : undefined}
              onClick={() => userGo(k)}
            >
              <span aria-hidden="true" />
            </button>
          ))}
      </div>
    </div>
  );
}
