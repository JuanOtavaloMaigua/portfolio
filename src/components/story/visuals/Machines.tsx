import { m } from 'motion/react';
import { Frame, blink, fade, usePlayback, type VisualProps } from './shared';

/** Four PLC-driven machines whose data ends up on paper: data trapped at the plant. */
export default function Machines({ labels, startHidden }: VisualProps) {
  const { ref, phase } = usePlayback(startHidden);
  const t = labels.machines;

  return (
    <Frame width={320} height={220} label={t.aria} phase={phase} svgRef={ref}>
      {t.machines.map((name, i) => {
        const x = 10 + i * 77;
        const cx = x + 33.5;
        return (
          <g key={name}>
            <m.g variants={fade} custom={i}>
              <rect x={x} y={20} width={67} height={58} rx={6} className="fill-surface stroke-fg" strokeWidth={1.25} />
              <text x={x + 8} y={33} fontSize={7} className="fill-muted">
                PLC
              </text>
              <rect x={x + 12} y={44} width={43} height={20} rx={3} className="stroke-muted" strokeWidth={1} />
              <path d={`M${x + 18} 54 H${x + 49}`} className="stroke-muted" strokeWidth={1} />
              <text x={cx} y={94} fontSize={8.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
            </m.g>
            <m.circle cx={x + 58} cy={30} r={3.5} className="fill-accent" {...blink(phase, i * 0.35)} />
            <m.path
              d={`M${cx} 102 V120 L160 146`}
              className="stroke-muted"
              strokeWidth={1}
              strokeDasharray="2 3"
              variants={fade}
              custom={i + 4}
            />
            {phase === 'play' && (
              <m.circle
                cx={cx}
                r={2}
                className="fill-accent"
                initial={{ cy: 102, opacity: 0 }}
                animate={{ cy: [102, 118], opacity: [0, 1, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: 'easeIn' }}
              />
            )}
          </g>
        );
      })}

      <m.g variants={fade} custom={8}>
        <path d="M140 150 H172 L180 158 V202 H140 Z" className="fill-bg stroke-fg" strokeWidth={1.25} />
        <path d="M172 150 V158 H180" className="stroke-fg" strokeWidth={1} />
        <path d="M147 168 H173 M147 176 H173 M147 184 H165 M147 192 H170" className="stroke-muted" strokeWidth={1} />
        <text x={192} y={180} fontSize={8.5} className="fill-muted">
          {t.paper}
        </text>
      </m.g>
    </Frame>
  );
}
