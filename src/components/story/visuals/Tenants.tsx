import { m } from 'motion/react';
import { Frame, draw, fade, growY, usePlayback, type VisualProps } from './shared';

/** Decorative bar heights inside the dashboard node, one per plant. */
const BARS = [0.6, 0.85, 0.5, 0.7];
const HUB: [number, number] = [196, 110];

/** Several client plants, each with its own recipes, served by one dashboard. */
export default function Tenants({ labels, startHidden }: VisualProps) {
  const { ref, phase } = usePlayback(startHidden);
  const t = labels.tenants;

  return (
    <Frame width={320} height={220} label={t.aria} phase={phase} svgRef={ref}>
      {t.plants.map((name, i) => {
        const y = 14 + i * 50;
        const from: [number, number] = [114, y + 18];
        return (
          <g key={name}>
            <m.path d={`M${from[0]} ${from[1]} L${HUB[0]} ${HUB[1]}`} className="stroke-muted" strokeWidth={1} variants={draw} custom={3 + i * 0.5} />
            <m.g variants={fade} custom={i * 0.6}>
              <rect x={10} y={y} width={104} height={36} rx={5} className="fill-surface stroke-fg" strokeWidth={1.25} />
              <path d={`M18 ${y + 27} V${y + 15} L23 ${y + 11} V${y + 15} L28 ${y + 11} V${y + 15} L33 ${y + 11} V${y + 27} Z`} className="stroke-fg" strokeWidth={1} />
              <text x={40} y={y + 21} fontSize={8.5} className="fill-fg">
                {name}
              </text>
              {[0, 1, 2].map((dot) => (
                <circle key={dot} cx={92 + dot * 7} cy={y + 29} r={1.75} className={dot === i % 3 ? 'fill-accent' : 'fill-muted'} />
              ))}
            </m.g>
            {phase === 'play' && (
              <m.circle
                r={2}
                className="fill-accent"
                initial={{ cx: from[0], cy: from[1], opacity: 0 }}
                animate={{ cx: [from[0], HUB[0]], cy: [from[1], HUB[1]], opacity: [0, 1, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.8, delay: 1.5 + i * 0.35, ease: 'linear' }}
              />
            )}
          </g>
        );
      })}

      <m.g variants={fade} custom={6}>
        <rect x={196} y={62} width={114} height={96} rx={6} className="fill-bg stroke-accent" strokeWidth={1.5} />
        <text x={206} y={78} fontSize={8.5} className="fill-fg">
          {t.dashboard}
        </text>
        <path d="M206 86 H300" className="stroke-border" strokeWidth={1} />
      </m.g>
      {BARS.map((v, i) => (
        <m.rect
          key={i}
          x={212 + i * 22}
          y={148 - v * 50}
          width={12}
          height={v * 50}
          rx={2}
          className={i === 1 ? 'fill-accent' : 'fill-muted'}
          style={{ originY: 1 }}
          variants={growY}
          custom={7 + i * 0.4}
        />
      ))}
    </Frame>
  );
}
