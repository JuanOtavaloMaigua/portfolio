import { m } from 'motion/react';
import { Frame, blink, draw, growX, growY, light, linePath, usePlayback, type VisualProps } from './shared';

type Labels = VisualProps['labels']['command'];
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Decorative shapes only, not data. */
const LINE = [0.2, 0.45, 0.35, 0.6, 0.55, 0.8, 0.72];
const BARS = [0.5, 0.75, 0.6, 0.9, 0.7, 0.85];
const SILOS = [0.7, 0.45, 0.85];
const RECIPE = [0.5, 0.5, 0.5, 0.5, 0.5];
const ACTUAL = [0.3, 0.55, 0.45, 0.6, 0.5];

/** Control room wall: six screens fed by one computer, lighting up one by one. */
export default function Command({ labels, orientation, startHidden }: VisualProps) {
  const { ref, phase } = usePlayback(startHidden);
  const t = labels.command;
  // Desktop: 3 columns x 2 rows. Mobile: 2 columns x 3 rows (fits 360px).
  const cols = orientation === 'vertical' ? 2 : 3;
  const rows = 6 / cols;
  const gap = 8;
  const w = (320 - gap * (cols + 1)) / cols;
  const h = (220 - gap * (rows + 1)) / rows;

  return (
    <Frame width={320} height={220} label={t.aria} phase={phase} svgRef={ref}>
      {t.screens.map((title, i) => {
        const x = gap + (i % cols) * (w + gap);
        const y = gap + Math.floor(i / cols) * (h + gap);
        const chart = { x: x + 8, y: y + 20, w: w - 16, h: h - 28 };
        const order = i * 2.2;
        return (
          <g key={title}>
            <m.g variants={light} custom={order}>
              <rect x={x} y={y} width={w} height={h} rx={4} className="fill-surface stroke-fg" strokeWidth={1.25} />
              <text x={x + 8} y={y + 13} fontSize={7.5} className="fill-muted">
                {title}
              </text>
            </m.g>
            <m.circle cx={x + w - 8} cy={y + 9} r={2} className="fill-accent" {...blink(phase, i * 0.2)} />
            <m.g variants={light} custom={order}>
              <Chart kind={i} box={chart} order={order + 1} t={t} />
            </m.g>
          </g>
        );
      })}
    </Frame>
  );
}

function Chart({ kind, box, order, t }: { kind: number; box: Box; order: number; t: Labels }) {
  const { x, y, w, h } = box;
  switch (kind) {
    case 0:
      return <m.path d={linePath(LINE, x, y, w, h)} className="stroke-accent" strokeWidth={1.5} variants={draw} custom={order} />;
    case 1: {
      const bw = w / BARS.length;
      return (
        <>
          {BARS.map((v, i) => (
            <m.rect
              key={i}
              x={x + i * bw + bw * 0.2}
              y={y + h - v * h}
              width={bw * 0.6}
              height={v * h}
              className={i === BARS.length - 1 ? 'fill-accent' : 'fill-muted'}
              style={{ originY: 1 }}
              variants={growY}
              custom={order + i * 0.2}
            />
          ))}
        </>
      );
    }
    case 2: {
      const barY = y + h / 2 - 6;
      return (
        <>
          <rect x={x} y={barY} width={w} height={8} rx={4} className="stroke-muted" strokeWidth={1} />
          <m.rect x={x} y={barY} width={w * 0.64} height={8} rx={4} className="fill-accent" style={{ originX: 0 }} variants={growX} custom={order} />
          <text x={x} y={barY + 20} fontSize={6.5} className="fill-fg">
            ■ {t.produced}
          </text>
          <text x={x + w} y={barY + 20} fontSize={6.5} textAnchor="end" className="fill-muted">
            {t.pending}
          </text>
        </>
      );
    }
    case 3: {
      const r = Math.min(w / 2, h) - 4;
      const cx = x + w / 2;
      const cy = y + h - 2;
      const arc = (end: number) => {
        const a = Math.PI * (1 - end);
        return `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${(cx + r * Math.cos(a)).toFixed(1)} ${(cy - r * Math.sin(a)).toFixed(1)}`;
      };
      return (
        <>
          <path d={arc(1)} className="stroke-border" strokeWidth={5} strokeLinecap="round" />
          <m.path d={arc(0.72)} className="stroke-accent" strokeWidth={5} strokeLinecap="round" variants={draw} custom={order} />
        </>
      );
    }
    case 4: {
      const sw = w / SILOS.length;
      return (
        <>
          {SILOS.map((v, i) => {
            const sx = x + i * sw + sw * 0.25;
            return (
              <g key={i}>
                <rect x={sx} y={y} width={sw * 0.5} height={h} rx={3} className="stroke-muted" strokeWidth={1} />
                <m.rect
                  x={sx + 2}
                  y={y + h - v * (h - 4) - 2}
                  width={sw * 0.5 - 4}
                  height={v * (h - 4)}
                  rx={2}
                  className={i === 0 ? 'fill-accent' : 'fill-muted'}
                  style={{ originY: 1 }}
                  variants={growY}
                  custom={order + i * 0.3}
                />
              </g>
            );
          })}
        </>
      );
    }
    default:
      return (
        <>
          <path d={linePath(RECIPE, x, y, w, h)} className="stroke-muted" strokeWidth={1} strokeDasharray="3 3" />
          <m.path d={linePath(ACTUAL, x, y, w, h)} className="stroke-accent" strokeWidth={1.5} variants={draw} custom={order} />
        </>
      );
  }
}
