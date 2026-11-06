import { m } from 'motion/react';
import { Frame, blink, draw, fade, usePlayback, wrap, type Phase, type VisualProps } from './shared';

type Labels = VisualProps['labels']['pipeline'];

/** Plant topology that connects itself: machines → PLC server → databases → control computer. */
export default function Pipeline({ labels, orientation, startHidden }: VisualProps) {
  const { ref, phase } = usePlayback(startHidden);
  const t = labels.pipeline;

  return (
    <Frame width={320} height={220} label={t.aria} phase={phase} svgRef={ref}>
      {orientation === 'vertical' ? <Vertical t={t} phase={phase} /> : <Horizontal t={t} phase={phase} />}
    </Frame>
  );
}

function Pulse({ phase, from, to, delay }: { phase: Phase; from: [number, number]; to: [number, number]; delay: number }) {
  if (phase !== 'play') return null;
  return (
    <m.circle
      r={2}
      className="fill-accent"
      initial={{ cx: from[0], cy: from[1], opacity: 0 }}
      animate={{ cx: [from[0], to[0]], cy: [from[1], to[1]], opacity: [0, 1, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6, delay: 2 + delay, ease: 'linear' }}
    />
  );
}

function Server({ x, y, w, phase }: { x: number; y: number; w: number; phase: Phase }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={44} rx={4} className="fill-surface stroke-fg" strokeWidth={1.25} />
      {[0, 1, 2].map((row) => (
        <g key={row}>
          <path d={`M${x + 6} ${y + 10 + row * 12} H${x + w - 16}`} className="stroke-muted" strokeWidth={1} />
          <m.circle cx={x + w - 9} cy={y + 10 + row * 12} r={2} className="fill-accent" {...blink(phase, row * 0.3)} />
        </g>
      ))}
    </>
  );
}

function Monitor({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect x={x} y={y} width={w} height={h} rx={3} className="fill-surface stroke-fg" strokeWidth={1.25} />
      <path
        d={`M${x + 6} ${y + h - 8} L${x + w * 0.35} ${y + h * 0.45} L${x + w * 0.6} ${y + h * 0.6} L${x + w - 6} ${y + 8}`}
        className="stroke-accent"
        strokeWidth={1.25}
      />
      <path d={`M${x + w / 2} ${y + h} V${y + h + 6} M${x + w / 2 - 10} ${y + h + 6} H${x + w / 2 + 10}`} className="stroke-fg" strokeWidth={1.25} />
    </>
  );
}

function Horizontal({ t, phase }: { t: Labels; phase: Phase }) {
  const dbY = [44, 78, 112];
  return (
    <>
      <m.text x={38} y={20} fontSize={8} textAnchor="middle" className="fill-muted" variants={fade} custom={0}>
        {t.machines}
      </m.text>
      {t.machineNames.map((name, i) => {
        const y = 32 + i * 32;
        return (
          <g key={name}>
            <m.g variants={fade} custom={i * 0.5}>
              <rect x={6} y={y} width={64} height={24} rx={4} className="fill-bg stroke-fg" strokeWidth={1} />
              <text x={38} y={y + 15} fontSize={7.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
            </m.g>
            <m.path d={`M70 ${y + 12} C82 ${y + 12} 80 90 92 90`} className="stroke-muted" strokeWidth={1} variants={draw} custom={3 + i * 0.3} />
          </g>
        );
      })}

      <m.g variants={fade} custom={5}>
        <Server x={92} y={68} w={58} phase={phase} />
        {wrap(t.plc, 12).map((line, i) => (
          <text key={line} x={121} y={126 + i * 10} fontSize={7.5} textAnchor="middle" className="fill-fg">
            {line}
          </text>
        ))}
        <text x={121} y={146} fontSize={7} textAnchor="middle" className="fill-muted">
          {t.plcVendor}
        </text>
      </m.g>

      {t.databases.map((name, i) => {
        const y = dbY[i] ?? 0;
        return (
          <g key={name}>
            <m.path d={`M150 90 C161 90 161 ${y + 12} 172 ${y + 12}`} className="stroke-muted" strokeWidth={1} variants={draw} custom={7 + i * 0.3} />
            <m.g variants={fade} custom={8 + i * 0.4}>
              <rect x={172} y={y} width={64} height={24} rx={12} className="fill-bg stroke-fg" strokeWidth={1} />
              <text x={204} y={y + 15} fontSize={7.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
            </m.g>
            <m.path d={`M236 ${y + 12} C247 ${y + 12} 247 90 258 90`} className="stroke-muted" strokeWidth={1} variants={draw} custom={10 + i * 0.3} />
          </g>
        );
      })}

      <m.g variants={fade} custom={12}>
        <Monitor x={258} y={70} w={58} h={40} />
        {wrap(t.computer, 11).map((line, i) => (
          <text key={line} x={287} y={134 + i * 10} fontSize={7.5} textAnchor="middle" className="fill-fg">
            {line}
          </text>
        ))}
        <text x={287} y={164} fontSize={7} textAnchor="middle" className="fill-muted">
          {t.computerSub}
        </text>
      </m.g>

      <Pulse phase={phase} from={[70, 90]} to={[92, 90]} delay={0} />
      <Pulse phase={phase} from={[150, 90]} to={[172, 90]} delay={0.4} />
      <Pulse phase={phase} from={[236, 90]} to={[258, 90]} delay={0.8} />
    </>
  );
}

function Vertical({ t, phase }: { t: Labels; phase: Phase }) {
  const dbX = [22, 122, 222];
  return (
    <>
      {t.machineNames.map((name, i) => {
        const x = 10 + i * 77;
        return (
          <g key={name}>
            <m.g variants={fade} custom={i * 0.5}>
              <rect x={x} y={6} width={67} height={24} rx={4} className="fill-bg stroke-fg" strokeWidth={1} />
              <text x={x + 33.5} y={21} fontSize={7.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
            </m.g>
            <m.path d={`M${x + 33.5} 30 C${x + 33.5} 44 160 40 160 58`} className="stroke-muted" strokeWidth={1} variants={draw} custom={3 + i * 0.3} />
          </g>
        );
      })}

      <m.g variants={fade} custom={5}>
        <rect x={96} y={58} width={128} height={30} rx={4} className="fill-surface stroke-fg" strokeWidth={1.25} />
        <text x={108} y={77} fontSize={8} className="fill-fg">
          {t.plc} · <tspan className="fill-muted">{t.plcVendor}</tspan>
        </text>
        <m.circle cx={214} cy={73} r={2.5} className="fill-accent" {...blink(phase)} />
      </m.g>

      {t.databases.map((name, i) => {
        const x = dbX[i] ?? 0;
        return (
          <g key={name}>
            <m.path d={`M160 88 C160 102 ${x + 38} 100 ${x + 38} 114`} className="stroke-muted" strokeWidth={1} variants={draw} custom={7 + i * 0.3} />
            <m.g variants={fade} custom={8 + i * 0.4}>
              <rect x={x} y={114} width={76} height={24} rx={12} className="fill-bg stroke-fg" strokeWidth={1} />
              <text x={x + 38} y={129} fontSize={7.5} textAnchor="middle" className="fill-fg">
                {name}
              </text>
            </m.g>
            <m.path d={`M${x + 38} 138 C${x + 38} 152 134 150 134 166`} className="stroke-muted" strokeWidth={1} variants={draw} custom={10 + i * 0.3} />
          </g>
        );
      })}

      <m.g variants={fade} custom={12}>
        <Monitor x={104} y={166} w={60} h={30} />
        <text x={176} y={182} fontSize={8} className="fill-fg">
          {t.computer}
        </text>
        <text x={176} y={194} fontSize={7} className="fill-muted">
          {t.computerSub}
        </text>
      </m.g>

      <Pulse phase={phase} from={[160, 40]} to={[160, 58]} delay={0} />
      <Pulse phase={phase} from={[160, 88]} to={[160, 102]} delay={0.4} />
      <Pulse phase={phase} from={[134, 150]} to={[134, 166]} delay={0.8} />
    </>
  );
}
