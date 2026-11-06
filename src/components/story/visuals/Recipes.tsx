import { m } from 'motion/react';
import { Frame, draw, fade, growX, usePlayback, type VisualProps } from './shared';

/** Relative bar lengths only (decorative, not data). */
const YIELDS = [0.82, 0.55, 0.68];
const PEOPLE_X = [70, 160, 250];

/** A recipe breaking down into materials with yields, and the three teams behind it. */
export default function Recipes({ labels, startHidden }: VisualProps) {
  const { ref, phase } = usePlayback(startHidden);
  const t = labels.recipes;

  return (
    <Frame width={320} height={220} label={t.aria} phase={phase} svgRef={ref}>
      <m.g variants={fade} custom={0}>
        <rect x={12} y={20} width={88} height={104} rx={6} className="fill-surface stroke-fg" strokeWidth={1.25} />
        <text x={22} y={38} fontSize={9} className="fill-fg">
          {t.recipe}
        </text>
        <path d="M22 46 H90" className="stroke-border" strokeWidth={1} />
        <path d="M22 60 H80 M22 74 H70 M22 88 H84 M22 102 H62" className="stroke-muted" strokeWidth={2} strokeLinecap="round" />
      </m.g>

      {t.materials.map((name, i) => {
        const y = 22 + i * 40;
        const barWidth = 84 * (YIELDS[i] ?? 0.5);
        return (
          <g key={name}>
            <m.path
              d={`M100 72 C125 72 125 ${y + 11} 150 ${y + 11}`}
              className="stroke-accent"
              strokeWidth={1.25}
              variants={draw}
              custom={i + 1}
            />
            <m.g variants={fade} custom={i + 2}>
              <rect x={150} y={y} width={66} height={22} rx={4} className="fill-bg stroke-fg" strokeWidth={1} />
              <text x={183} y={y + 14.5} fontSize={8.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
              <rect x={224} y={y + 8} width={84} height={6} rx={3} className="fill-border" />
            </m.g>
            <m.rect
              x={224}
              y={y + 8}
              width={barWidth}
              height={6}
              rx={3}
              className="fill-accent"
              style={{ originX: 0 }}
              variants={growX}
              custom={i + 4}
            />
          </g>
        );
      })}

      <m.path
        d="M80 170 H150 M170 170 H240 M70 160 V124 M160 160 V136 Q160 128 168 126"
        className="stroke-muted"
        strokeWidth={1}
        strokeDasharray="3 3"
        variants={fade}
        custom={7}
      />
      {t.people.map((name, i) => {
        const cx = PEOPLE_X[i] ?? 0;
        return (
          <m.g key={name} variants={fade} custom={8 + i}>
            <circle cx={cx} cy={170} r={10} className="fill-bg stroke-fg" strokeWidth={1.25} />
            <circle cx={cx} cy={167} r={3} className="fill-fg" />
            <path d={`M${cx - 5} 176 Q${cx} 170 ${cx + 5} 176`} className="stroke-fg" strokeWidth={1.25} />
            <text x={cx} y={196} fontSize={8} textAnchor="middle" className="fill-muted">
              {name}
            </text>
          </m.g>
        );
      })}
    </Frame>
  );
}
