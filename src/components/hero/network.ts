/**
 * Deterministic node network shared by the server-rendered SVG poster and the WebGL canvas,
 * so both show the same graph. "One engineer, many connected industries": a few accent hubs
 * among small neutral nodes.
 */

export interface NetworkNode {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly hub: boolean;
}

export type Edge = readonly [number, number];

export interface NetworkGraph {
  readonly nodes: readonly NetworkNode[];
  readonly edges: readonly Edge[];
}

/** Fine pointers (desktop) get the full graph; touch devices a lighter prefix of it. */
export const NODE_COUNT_FINE = 40;
export const NODE_COUNT_COARSE = 18;

/** Camera shared by the poster projection and the R3F scene. */
export const CAMERA_Z = 5;
export const CAMERA_FOV = 30;

/** Node diameters in CSS pixels. */
export const NODE_SIZE = 4;
export const HUB_SIZE = 7;

const HALF_EXTENT = { x: 2.05, y: 1.05, z: 0.8 } as const;
const MIN_DISTANCE = 0.38;
const SEED = 20_240_611;

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function distance(a: NetworkNode, b: NetworkNode): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

/** Every 8th node is an industry hub, so the touch subset still carries three hubs. */
const isHub = (index: number) => index % 8 === 0;

function generateNodes(count: number): NetworkNode[] {
  const random = mulberry32(SEED);
  const nodes: NetworkNode[] = [];
  let attempts = 0;
  while (nodes.length < count && attempts < 5000) {
    attempts += 1;
    const candidate: NetworkNode = {
      x: (random() * 2 - 1) * HALF_EXTENT.x,
      y: (random() * 2 - 1) * HALF_EXTENT.y,
      z: (random() * 2 - 1) * HALF_EXTENT.z,
      hub: isHub(nodes.length),
    };
    if (nodes.every((node) => distance(node, candidate) >= MIN_DISTANCE)) nodes.push(candidate);
  }
  return nodes;
}

function buildEdges(nodes: readonly NetworkNode[]): Edge[] {
  const seen = new Set<string>();
  const edges: Edge[] = [];
  nodes.forEach((node, i) => {
    const neighbours = nodes
      .map((other, j) => ({ j, d: distance(node, other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, node.hub ? 4 : 2);
    neighbours.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      edges.push(i < j ? [i, j] : [j, i]);
    });
  });
  return edges;
}

const ALL_NODES = generateNodes(NODE_COUNT_FINE);

export function getNetwork(count: number): NetworkGraph {
  const nodes = ALL_NODES.slice(0, count);
  return { nodes, edges: buildEdges(nodes) };
}

/**
 * Projects a node the way the R3F perspective camera does at rotation 0, into an SVG viewBox
 * of "-100 -100 200 200" where the vertical extent matches the canvas height.
 */
export function projectToPoster(node: NetworkNode): { x: number; y: number } {
  const halfHeight = (CAMERA_Z - node.z) * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180);
  return { x: (node.x / halfHeight) * 100, y: (-node.y / halfHeight) * 100 };
}
