/**
 * Hero product network: the products and solutions I have built, all at once, linked where they work together.
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

export interface Point {
  x: number;
  y: number;
}

export interface ProductLayout {
  width: number;
  height: number;
  nodes: Record<ProductId, Point>;
}

/**
 * Pill centers in viewBox units. Pills are sized in CSS px, so each layout is drawn 1:1 at its width and only
 * shrinks a little below it. Hand-tuned so no pill overlaps another and no link runs under a pill it does not
 * connect, for the longest label in either locale, at the narrowest width each layout serves.
 */

/** Phones (< 640px): 328px wide (a 360px screen minus gutters), up to 420px. */
const compact: ProductLayout = {
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

/** Tablets and desktop (>= 640px): the 720px content column, 592-672px rendered. */
const wide: ProductLayout = {
  width: 672,
  height: 300,
  nodes: {
    erp: { x: 330, y: 138 },
    textile: { x: 236, y: 26 },
    rfid: { x: 86, y: 86 },
    infra: { x: 466, y: 44 },
    dashboards: { x: 562, y: 124 },
    forecasting: { x: 514, y: 214 },
    ai: { x: 120, y: 176 },
    crm: { x: 196, y: 256 },
    apps: { x: 370, y: 262 },
    esign: { x: 566, y: 284 },
  },
};

export const PRODUCT_LAYOUTS = { compact, wide } as const;
export type ProductLayoutKey = keyof typeof PRODUCT_LAYOUTS;
export const PRODUCT_LAYOUT_KEYS = Object.keys(PRODUCT_LAYOUTS) as ProductLayoutKey[];
/** Must match the breakpoint in global.css that swaps the compact layout for the wide one. */
export const WIDE_QUERY = '(min-width: 640px)';
