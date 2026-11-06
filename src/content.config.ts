import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Entries live in one folder per locale: src/content/<collection>/<lang>/<slug>.md
 * The locale is derived from the entry id (e.g. "es/textile-erp").
 */
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    /** One-line context. Keep clients anonymous unless you have permission. */
    context: z.string(),
    problem: z.string(),
    solution: z.string(),
    result: z.string(),
    tech: z.array(z.string()).min(1),
    status: z.enum(['production', 'development']),
    order: z.number().int(),
    featured: z.boolean().default(true),
    /** Optional client name, only rendered when set. */
    client: z.string().optional(),
  }),
});

/** Keys of the animated diagrams available to story blocks (see src/components/story/visuals). */
export const STORY_VISUALS = ['machines', 'recipes', 'pipeline', 'command', 'tenants'] as const;

/**
 * Optional case study ("story") for an experience entry. When present, the entry gets
 * its own page at /trabajo/<slug> (es) and /en/work/<slug> (en), and the markdown body
 * of the entry is rendered as the "Technical details" section.
 * Role, location and period are taken from the experience entry itself.
 */
const story = z.object({
  title: z.string(),
  /** Business-language summary; also used as meta description. */
  summary: z.string().max(200),
  industry: z.string(),
  stack: z.array(z.string()).min(1),
  blocks: z
    .array(
      z.object({
        /** Anchor id, unique within the story. */
        id: z.string().regex(/^[a-z0-9-]+$/),
        eyebrow: z.string(),
        title: z.string(),
        /** Plain text; separate paragraphs with a blank line. */
        body: z.string(),
        visual: z.enum(STORY_VISUALS),
      }),
    )
    .min(1)
    .refine((blocks) => new Set(blocks.map((b) => b.id)).size === blocks.length, {
      message: 'Story block ids must be unique',
    }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string(),
    /** The first day of the month is enough, e.g. 2025-01-01. */
    start: z.coerce.date(),
    /** Omit for a current position. */
    end: z.coerce.date().optional(),
    summary: z.string(),
    order: z.number().int(),
    story: story.optional(),
  }),
});

export const collections = { projects, experience };
