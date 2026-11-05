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
  }),
});

export const collections = { projects, experience };
