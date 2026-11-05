import type { Dictionary } from './es';

/** English UI strings. Must match the shape of es.ts. */
const en: Dictionary = {
  meta: {
    title: 'Juan Otavalo — Full Stack Engineer based in Ecuador',
    description:
      'Custom ERPs, RFID traceability, industrial data and AI agents for companies in Ecuador and worldwide.',
    labTitle: 'Lab — Juan Otavalo',
    labDescription: 'Interactive 3D experiments. Coming soon.',
    notFoundTitle: 'Page not found — Juan Otavalo',
    notFoundDescription: 'The page you are looking for does not exist.',
  },
  a11y: {
    skipToContent: 'Skip to content',
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    toggleTheme: 'Toggle light and dark theme',
    language: 'Language',
    avatarAlt: 'Photo of Juan Otavalo',
    home: 'Juan Otavalo, home',
  },
  nav: {
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
  },
  hero: {
    title: 'I build the software that keeps industries moving.',
    subtitle:
      'Custom ERPs, RFID traceability, industrial data and AI agents for companies in Ecuador and around the world.',
    tagline: 'Full Stack Engineer · Ecuador · Django · React · TypeScript',
    ctaPrimary: 'Book a call',
    ctaSecondary: 'Email me',
    availability: 'Available for new projects',
  },
  projects: {
    eyebrow: '01 · Projects',
    title: 'Featured projects',
    intro: 'Case studies of systems in production and in development.',
    problem: 'Problem',
    solution: 'Solution',
    result: 'Result',
    client: 'Client',
    tech: 'Technologies',
    status: {
      production: 'In production',
      development: 'In development',
    },
  },
  experience: {
    eyebrow: '02 · Experience',
    title: 'Experience',
    present: 'Present',
  },
  process: {
    eyebrow: '03 · Process',
    title: 'How I work',
    steps: [
      {
        title: 'Understand the business',
        text: 'Before writing code, I map processes, bottlenecks and what actually moves the needle.',
      },
      {
        title: 'Rapid prototype',
        text: 'A working first version in weeks, not months, validated with real users.',
      },
      {
        title: 'Production deployment',
        text: 'Simple, robust infrastructure, CI/CD and data migrated without stopping operations.',
      },
      {
        title: 'Maintenance and monitoring',
        text: 'Backups, alerts and continuous improvements so the system keeps running as it grows.',
      },
    ],
  },
  stack: {
    eyebrow: '04 · Stack',
    title: 'Stack',
    groups: {
      backend: 'Backend',
      frontend: 'Frontend',
      mobile: 'Mobile',
      data: 'Data & AI',
      infra: 'Infra',
    },
  },
  contact: {
    eyebrow: '05 · Contact',
    title: 'Have a project in mind?',
    text: "Tell me what you need and I'll get back to you soon.",
    email: 'Email',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    schedule: 'Book a call',
    sticky: "Let's talk",
  },
  footer: {
    rights: 'Juan Otavalo',
    lab: 'Lab',
  },
  lab: {
    eyebrow: 'Lab',
    title: 'Coming soon',
    text: 'A space for interactive 3D experiments. Work in progress.',
    back: 'Back to home',
  },
  notFound: {
    title: 'Page not found',
    text: 'The page you are looking for does not exist or has moved.',
    back: 'Back to home',
  },
};

export default en;
