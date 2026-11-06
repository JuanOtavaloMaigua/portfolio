import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '@/i18n';

/** Entry ids look like "es/textile-erp"; the first segment is the locale. */
const byLocale = (locale: Locale) => (entry: { id: string }) => entry.id.startsWith(`${locale}/`);

export async function getFeaturedProjects(locale: Locale): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getCollection('projects', (entry) => byLocale(locale)(entry) && entry.data.featured);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

export async function getExperience(locale: Locale): Promise<CollectionEntry<'experience'>[]> {
  const entries = await getCollection('experience', byLocale(locale));
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** "es/caiheng" -> "caiheng". The slug is shared by both locales. */
export function entrySlug(entry: { id: string }): string {
  return entry.id.slice(entry.id.indexOf('/') + 1);
}

export type StoryEntry = CollectionEntry<'experience'> & {
  data: CollectionEntry<'experience'>['data'] & { story: NonNullable<CollectionEntry<'experience'>['data']['story']> };
};

const hasStory = (entry: CollectionEntry<'experience'>): entry is StoryEntry => entry.data.story !== undefined;

/** Experience entries that have a story (case study) page in the given locale. */
export async function getStories(locale: Locale): Promise<StoryEntry[]> {
  const entries = await getExperience(locale);
  return entries.filter(hasStory);
}
