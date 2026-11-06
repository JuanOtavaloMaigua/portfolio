/**
 * Hero network: industries I have shipped software for, and the technologies each one ran on.
 * Shared technologies are single nodes on purpose: they are what connects the industries.
 * Industry labels are words (translated in src/i18n); technology names are proper nouns.
 */

export const INDUSTRIES = ['food', 'textile', 'retail', 'ai', 'finance'] as const;
export type IndustryId = (typeof INDUSTRIES)[number];

export const TECHS = {
  plc: 'PLC/SCADA',
  flask: 'Flask',
  mongo: 'MongoDB',
  sqlserver: 'SQL Server',
  redis: 'Redis',
  react: 'React',
  rfid: 'RFID',
  django: 'Django',
  postgres: 'PostgreSQL',
  prophet: 'Prophet',
  vertex: 'Vertex AI',
  python: 'Python',
  nest: 'NestJS',
  rn: 'React Native',
} as const;
export type TechId = keyof typeof TECHS;
export const TECH_IDS = Object.keys(TECHS) as TechId[];

/** Technologies per industry, in reading order. Every pair becomes one edge. */
export const STACKS: Record<IndustryId, readonly TechId[]> = {
  food: ['plc', 'flask', 'mongo', 'sqlserver', 'redis', 'react'],
  textile: ['react', 'django', 'postgres', 'rfid'],
  retail: ['django', 'postgres', 'prophet', 'vertex'],
  ai: ['python', 'postgres'],
  finance: ['nest', 'rn'],
};

export interface Edge {
  industry: IndustryId;
  tech: TechId;
}

export const EDGES: readonly Edge[] = INDUSTRIES.flatMap((industry) => STACKS[industry].map((tech) => ({ industry, tech })));

/** Industries a technology connects, in INDUSTRIES order. */
export function industriesOf(tech: TechId): IndustryId[] {
  return INDUSTRIES.filter((industry) => STACKS[industry].includes(tech));
}

/** Story (case study) slug per industry, when one exists. */
export const INDUSTRY_STORIES: Partial<Record<IndustryId, string>> = { food: 'caiheng' };

export type LabelSide = 'top' | 'bottom' | 'left' | 'right';

export interface Point {
  x: number;
  y: number;
}

export interface TechPoint extends Point {
  label: LabelSide;
}

export interface NetworkLayout {
  width: number;
  height: number;
  /** Font sizes in viewBox units; chosen so rendered text stays >= 11px at the smallest width. */
  industryFont: number;
  techFont: number;
  industries: Record<IndustryId, Point>;
  techs: Record<TechId, TechPoint>;
}

/*
 * From 640px up the network is the hero background and the hero copy (title, tagline, buttons) is drawn over it,
 * starting at --copy-top viewBox units from the top (set per breakpoint in global.css). Each layout keeps every
 * label out of the area the copy covers at the narrowest width it serves (where the copy is tallest
 * relative to the drawing); only edges and pulses run behind the text.
 * Phones (< 640px) get the product network instead (PRODUCT_LINKS / PRODUCT_LAYOUT below).
 */

/** Tablets (640-1023px): the width of the 720px content column, 592-672px rendered. */
const tablet: NetworkLayout = {
  width: 680,
  height: 600,
  industryFont: 13.5,
  techFont: 13,
  industries: {
    finance: { x: 50, y: 450 },
    food: { x: 192, y: 450 },
    textile: { x: 330, y: 450 },
    retail: { x: 472, y: 450 },
    ai: { x: 630, y: 450 },
  },
  techs: {
    // Above the title.
    nest: { x: 12, y: 16, label: 'right' },
    plc: { x: 150, y: 16, label: 'right' },
    flask: { x: 290, y: 16, label: 'right' },
    mongo: { x: 430, y: 16, label: 'right' },
    // Beside the buttons.
    vertex: { x: 470, y: 272, label: 'right' },
    python: { x: 600, y: 272, label: 'right' },
    // Below the copy.
    sqlserver: { x: 110, y: 350, label: 'top' },
    react: { x: 260, y: 350, label: 'top' },
    django: { x: 400, y: 350, label: 'top' },
    prophet: { x: 540, y: 350, label: 'top' },
    rn: { x: 50, y: 556, label: 'bottom' },
    redis: { x: 210, y: 556, label: 'bottom' },
    rfid: { x: 330, y: 556, label: 'bottom' },
    postgres: { x: 520, y: 556, label: 'bottom' },
  },
};

/** Desktop (>= 1024px): wider than the content column, so the copy sits in the middle of the drawing. */
const desktop: NetworkLayout = {
  width: 1120,
  height: 610,
  industryFont: 13.5,
  techFont: 13,
  industries: {
    finance: { x: 84, y: 160 },
    ai: { x: 1010, y: 160 },
    food: { x: 270, y: 480 },
    textile: { x: 560, y: 480 },
    retail: { x: 830, y: 480 },
  },
  techs: {
    // Above the title: their edges to food run behind the copy.
    plc: { x: 300, y: 22, label: 'right' },
    flask: { x: 560, y: 22, label: 'right' },
    // Either side of the copy.
    nest: { x: 40, y: 70, label: 'right' },
    rn: { x: 40, y: 250, label: 'right' },
    python: { x: 1076, y: 70, label: 'left' },
    // Below the copy.
    sqlserver: { x: 150, y: 390, label: 'top' },
    react: { x: 430, y: 390, label: 'top' },
    django: { x: 690, y: 390, label: 'top' },
    postgres: { x: 910, y: 390, label: 'top' },
    mongo: { x: 150, y: 575, label: 'bottom' },
    redis: { x: 330, y: 575, label: 'bottom' },
    rfid: { x: 560, y: 575, label: 'bottom' },
    prophet: { x: 760, y: 575, label: 'bottom' },
    vertex: { x: 920, y: 575, label: 'bottom' },
  },
};

export const NETWORK_LAYOUTS = { tablet, desktop } as const;
export type LayoutKey = keyof typeof NETWORK_LAYOUTS;

/*
 * Phones (< 640px): the products and solutions I have built, all at once, linked where they work together.
 * Names and one-line descriptions are translated in src/i18n (hero.network.products).
 */

export const PRODUCT_IDS = ['erp', 'textile', 'rfid', 'dashboards', 'forecasting', 'ai', 'crm', 'apps', 'esign', 'infra'] as const;
export type ProductId = (typeof PRODUCT_IDS)[number];

/** Products that work together. Undirected; each pair is one edge. */
export const PRODUCT_LINKS: readonly (readonly [ProductId, ProductId])[] = [
  ['erp', 'textile'],
  ['erp', 'rfid'],
  ['textile', 'rfid'],
  ['erp', 'ai'],
  ['erp', 'crm'],
  ['erp', 'infra'],
  ['dashboards', 'forecasting'],
  ['dashboards', 'infra'],
  ['forecasting', 'ai'],
  ['ai', 'crm'],
  ['crm', 'apps'],
  ['apps', 'esign'],
];

/** Products directly linked to one product. */
export function productNeighbors(id: ProductId): ProductId[] {
  return PRODUCT_LINKS.flatMap(([a, b]) => (a === id ? [b] : b === id ? [a] : []));
}

/** Story (case study) slug per product, when one exists. */
export const PRODUCT_STORIES: Partial<Record<ProductId, string>> = { dashboards: 'caiheng' };

/**
 * Pill centers in viewBox units, drawn 1:1 at 328px wide (a 360px screen minus gutters) and up to 420px.
 * Hand-tuned so no pill overlaps another and no link runs under a pill it does not connect, for the longest
 * label in either locale.
 */
export const PRODUCT_LAYOUT: { width: number; height: number; nodes: Record<ProductId, Point> } = {
  width: 328,
  height: 304,
  nodes: {
    erp: { x: 171, y: 122 },
    textile: { x: 138, y: 13 },
    rfid: { x: 74, y: 65 },
    dashboards: { x: 243, y: 178 },
    forecasting: { x: 253, y: 237 },
    ai: { x: 52, y: 168 },
    crm: { x: 73, y: 237 },
    apps: { x: 110, y: 290 },
    esign: { x: 262, y: 289 },
    infra: { x: 248, y: 65 },
  },
};
