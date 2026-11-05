import {
  siCloudflare,
  siCoolify,
  siDjango,
  siDocker,
  siFlask,
  siGithubactions,
  siGooglecloud,
  siHetzner,
  siJetpackcompose,
  siKotlin,
  siMongodb,
  siNestjs,
  siNextdotjs,
  siPostgresql,
  siPython,
  siReact,
  siReactquery,
  siSentry,
  siTailwindcss,
  siTypescript,
} from 'simple-icons';
import type { Dictionary } from '@/i18n/es';

/** SVG path (24x24 viewBox) rendered at build time; techs without a simple icon render text-only. */
export interface Tech {
  name: string;
  iconPath?: string;
}

export interface StackGroup {
  key: keyof Dictionary['stack']['groups'];
  items: Tech[];
}

const t = (name: string, icon?: { path: string }): Tech => (icon ? { name, iconPath: icon.path } : { name });

export const STACK: StackGroup[] = [
  {
    key: 'backend',
    items: [t('Python', siPython), t('Django', siDjango), t('DRF'), t('NestJS', siNestjs), t('Flask', siFlask)],
  },
  {
    key: 'frontend',
    items: [
      t('TypeScript', siTypescript),
      t('React', siReact),
      t('Next.js', siNextdotjs),
      t('TanStack Query', siReactquery),
      t('Tailwind', siTailwindcss),
      t('Zustand'),
    ],
  },
  {
    key: 'mobile',
    items: [t('Kotlin', siKotlin), t('Jetpack Compose', siJetpackcompose), t('React Native', siReact)],
  },
  {
    key: 'data',
    items: [
      t('PostgreSQL', siPostgresql),
      t('MongoDB', siMongodb),
      t('SQL Server'),
      t('Prophet'),
      t('Darts'),
      t('Vertex AI', siGooglecloud),
    ],
  },
  {
    key: 'infra',
    items: [
      t('Docker', siDocker),
      t('Coolify', siCoolify),
      t('Hetzner', siHetzner),
      t('Cloudflare R2', siCloudflare),
      t('Sentry', siSentry),
      t('GitHub Actions', siGithubactions),
    ],
  },
];
