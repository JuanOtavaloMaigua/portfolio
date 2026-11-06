/**
 * WebGL version of the hero node network (React Three Fiber).
 * Two draw calls: one Points (round sprites via a tiny shader) and one LineSegments.
 * Never mounted directly by Astro: `mountHeroNetwork` loads it after idle/interaction.
 */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  LineBasicMaterial,
  LinearSRGBColorSpace,
  ShaderMaterial,
  type Group,
} from 'three';
import {
  CAMERA_FOV,
  CAMERA_Z,
  HUB_SIZE,
  NODE_COUNT_COARSE,
  NODE_COUNT_FINE,
  NODE_SIZE,
  getNetwork,
} from './network';

interface Palette {
  readonly neutral: string;
  readonly accent: string;
}

function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  return {
    neutral: style.getPropertyValue('--color-muted').trim() || '#57534e',
    accent: style.getPropertyValue('--color-accent').trim() || '#b4232a',
  };
}

/** Re-reads the CSS tokens whenever the theme attribute on <html> changes. */
function usePalette(): Palette {
  const [palette, setPalette] = useState(readPalette);
  useEffect(() => {
    const observer = new MutationObserver(() => setPalette(readPalette()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return palette;
}

const VERTEX_SHADER = /* glsl */ `
  attribute float aHub;
  uniform float uPixelRatio;
  uniform float uNodeSize;
  uniform float uHubSize;
  varying float vHub;
  void main() {
    vHub = aHub;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float depthScale = clamp(${CAMERA_Z.toFixed(1)} / -mvPosition.z, 0.75, 1.3);
    gl_PointSize = mix(uNodeSize, uHubSize, aHub) * uPixelRatio * depthScale;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uNeutral;
  uniform vec3 uAccent;
  varying float vHub;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float edge = 1.0 - smoothstep(0.38, 0.5, d);
    if (edge <= 0.0) discard;
    gl_FragColor = vec4(mix(uNeutral, uAccent, vHub), mix(0.55, 0.85, vHub) * edge);
  }
`;

interface SceneProps {
  readonly coarse: boolean;
  readonly palette: Palette;
}

function NetworkScene({ coarse, palette }: SceneProps) {
  const group = useRef<Group>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const pointer = useRef({ x: 0, y: 0 });
  const motion = useRef({ angle: 0, time: 0, tiltX: 0, tiltY: 0 });

  const { nodes, edges } = useMemo(() => getNetwork(coarse ? NODE_COUNT_COARSE : NODE_COUNT_FINE), [coarse]);

  const { pointGeometry, lineGeometry, base, drift } = useMemo(() => {
    const base = new Float32Array(nodes.length * 3);
    const hubs = new Float32Array(nodes.length);
    const drift = nodes.map((_, i) => ({ phase: i * 1.7, speed: 0.25 + ((i * 37) % 11) / 40 }));
    nodes.forEach((node, i) => {
      base.set([node.x, node.y, node.z], i * 3);
      hubs[i] = node.hub ? 1 : 0;
    });
    const pointGeometry = new BufferGeometry();
    pointGeometry.setAttribute('position', new BufferAttribute(base.slice(), 3));
    pointGeometry.setAttribute('aHub', new BufferAttribute(hubs, 1));
    const lineGeometry = new BufferGeometry();
    lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(edges.length * 6), 3));
    return { pointGeometry, lineGeometry, base, drift };
  }, [nodes, edges]);

  const pointMaterial = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          uPixelRatio: { value: 1 },
          uNodeSize: { value: NODE_SIZE },
          uHubSize: { value: HUB_SIZE },
          uNeutral: { value: new Color() },
          uAccent: { value: new Color() },
        },
      }),
    [],
  );
  const lineMaterial = useMemo(
    () => new LineBasicMaterial({ transparent: true, opacity: 0.28, depthTest: false, depthWrite: false }),
    [],
  );

  // The canvas runs `linear` (no output conversion), so CSS hex values are stored as-is:
  // tagging them as linear skips three's sRGB -> linear conversion and matches the poster exactly.
  useEffect(() => {
    (pointMaterial.uniforms['uNeutral']?.value as Color).setStyle(palette.neutral, LinearSRGBColorSpace);
    (pointMaterial.uniforms['uAccent']?.value as Color).setStyle(palette.accent, LinearSRGBColorSpace);
    lineMaterial.color.setStyle(palette.neutral, LinearSRGBColorSpace);
  }, [palette, pointMaterial, lineMaterial]);

  useEffect(() => {
    const uniform = pointMaterial.uniforms['uPixelRatio'];
    if (uniform) uniform.value = dpr;
  }, [dpr, pointMaterial]);

  useEffect(
    () => () => {
      pointGeometry.dispose();
      lineGeometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
    },
    [pointGeometry, lineGeometry, pointMaterial, lineMaterial],
  );

  // Desktop only: follow the cursor anywhere in the window (the canvas itself ignores pointer events).
  useEffect(() => {
    if (coarse) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [coarse]);

  useFrame((_, rawDelta) => {
    const g = group.current;
    if (!g) return;
    // Clamp so resuming after a pause does not jump.
    const delta = Math.min(rawDelta, 0.05);
    const m = motion.current;
    m.time += delta;

    if (coarse) {
      m.angle += delta * 0.035;
      const scroll = window.scrollY;
      g.rotation.y = m.angle + scroll * 0.0015;
      g.rotation.x = Math.sin(m.time * 0.1) * 0.08 + scroll * 0.0004;
    } else {
      m.angle += delta * 0.05;
      const ease = 1 - Math.exp(-delta * 2.5);
      m.tiltX += (pointer.current.y * 0.18 - m.tiltX) * ease;
      m.tiltY += (pointer.current.x * 0.35 - m.tiltY) * ease;
      g.rotation.y = m.angle + m.tiltY;
      g.rotation.x = m.tiltX;
      g.position.x = m.tiltY * 0.3;
      g.position.y = -m.tiltX * 0.3;
    }

    const positions = pointGeometry.getAttribute('position') as BufferAttribute;
    const p = positions.array as Float32Array;
    drift.forEach(({ phase, speed }, i) => {
      const o = i * 3;
      p[o] = (base[o] ?? 0) + Math.sin(m.time * speed + phase) * 0.06;
      p[o + 1] = (base[o + 1] ?? 0) + Math.cos(m.time * speed * 0.8 + phase) * 0.06;
      p[o + 2] = base[o + 2] ?? 0;
    });
    positions.needsUpdate = true;

    const lines = lineGeometry.getAttribute('position') as BufferAttribute;
    const l = lines.array as Float32Array;
    edges.forEach(([a, b], e) => {
      for (let k = 0; k < 3; k += 1) {
        l[e * 6 + k] = p[a * 3 + k] ?? 0;
        l[e * 6 + 3 + k] = p[b * 3 + k] ?? 0;
      }
    });
    lines.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeometry} material={lineMaterial} renderOrder={0} />
      <points geometry={pointGeometry} material={pointMaterial} renderOrder={1} />
    </group>
  );
}

export interface HeroNetworkProps {
  /** Element observed to pause rendering when the hero leaves the viewport. */
  readonly host: HTMLElement;
  readonly coarse: boolean;
  readonly onReady: () => void;
}

export default function HeroNetwork({ host, coarse, onReady }: HeroNetworkProps) {
  const palette = usePalette();
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === 'visible');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false));
    observer.observe(host);
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [host]);

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, 1.5]}
      linear
      flat
      frameloop={inView && pageVisible ? 'always' : 'never'}
      camera={{ fov: CAMERA_FOV, position: [0, 0, CAMERA_Z], near: 0.1, far: 20 }}
      gl={{ antialias: !coarse, alpha: true, depth: false, stencil: false, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'none' }}
      onCreated={() => requestAnimationFrame(() => requestAnimationFrame(onReady))}
    >
      <NetworkScene coarse={coarse} palette={palette} />
    </Canvas>
  );
}
