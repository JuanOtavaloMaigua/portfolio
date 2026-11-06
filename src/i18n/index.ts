import es, { type Dictionary } from './es';
import en from './en';

export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'es';

/** BCP 47 tags used for <html lang>, hreflang and Open Graph. */
export const LOCALE_TAGS: Record<Locale, { html: string; og: string }> = {
  es: { html: 'es', og: 'es_EC' },
  en: { html: 'en', og: 'en_US' },
};

/** Native language names, used by the language switcher. */
export const LOCALE_NAMES: Record<Locale, string> = { es: 'Español', en: 'English' };

const dictionaries: Record<Locale, Dictionary> = { es, en };

export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Resolves the locale from Astro.currentLocale, falling back to the default. */
export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/**
 * A route without locale prefix. Use a per-locale record when the slug itself is
 * translated, e.g. { es: "trabajo/caiheng", en: "work/caiheng" }.
 */
export type LocalizedPath = string | Record<Locale, string>;

/**
 * Builds a locale-aware path. `path` is the route without locale prefix,
 * e.g. "" for home or "lab". The default locale is served without a prefix.
 */
export function localizePath(locale: Locale, path: LocalizedPath = ''): string {
  const route = typeof path === 'string' ? path : path[locale];
  const clean = route.replace(/^\/+|\/+$/g, '');
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return clean ? `${prefix}/${clean}/` : `${prefix}/`;
}

/** Translated first segment of story (case study) routes: /trabajo/<slug> and /en/work/<slug>. */
export const STORY_SEGMENTS: Record<Locale, string> = { es: 'trabajo', en: 'work' };

/** Unprefixed story routes for every locale, for links, canonical and hreflang. */
export function storyPaths(slug: string): Record<Locale, string> {
  return { es: `${STORY_SEGMENTS.es}/${slug}`, en: `${STORY_SEGMENTS.en}/${slug}` };
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** Explicit short month names: ICU output varies by runtime (e.g. "sept." vs "sep"). */
const SHORT_MONTHS: Record<Locale, readonly string[]> = {
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/** Formats a date as "Ene 2025" / "Jan 2025". Dates are stored as UTC midnight. */
export function formatMonthYear(date: Date, locale: Locale): string {
  return `${SHORT_MONTHS[locale][date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
