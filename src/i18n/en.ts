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
    home: 'Juan Otavalo, home',
  },
  nav: {
    projects: 'Projects',
    experience: 'Experience',
    contact: 'Contact',
  },
  hero: {
    title: 'I build the software that keeps industries moving.',
    tagline: 'Full Stack Engineer',
    cta: "Let's talk",
    network: {
      aria: 'Network of the industries and technologies I have built software with',
      listTitle: 'Industries and technologies',
      summary: 'One engineer, five industries connected by the same technologies.',
      hint: 'Pick an industry or technology to see its connections.',
      storyLink: 'Read the story',
      productsAria: 'Products and solutions I have built, and how they connect',
      productsTitle: 'Products and solutions',
      productsSummary: 'Products I have built and how they connect.',
      productsHint: 'Tap a product to see how it connects',
      products: {
        erp: {
          name: 'Custom ERP',
          description: 'Inventory, production and sales in one multi-tenant system shared by several textile companies.',
        },
        textile: {
          name: 'Textile software',
          description: 'The ERP of a textile manufacturer: inventory, production and labeling of every garment.',
        },
        rfid: {
          name: 'RFID traceability',
          description: 'RFID labeling with Zebra printers that cut container unloading time in half.',
        },
        dashboards: {
          name: 'Industrial dashboards',
          description: 'Live PLC/SCADA data for animal-feed plants, with a 6-screen control room.',
        },
        forecasting: {
          name: 'Sales forecasting',
          description: 'Demand forecasting models (Prophet, Darts, N-BEATS) to cut inventory costs.',
        },
        ai: {
          name: 'AI agents',
          description: 'An agent that answers natural-language questions about ERP data.',
        },
        crm: {
          name: 'Omnichannel CRM',
          description: 'WhatsApp, Facebook and Instagram in a single inbox, built on Chatwoot and the WhatsApp Cloud API.',
        },
        apps: {
          name: 'Mobile apps',
          description: 'A React Native app for the Stock Exchange, tied into the stock-purchase flow.',
        },
        esign: {
          name: 'E-signature',
          description: 'Electronic signature built into the Stock Exchange stock-purchase flow.',
        },
        infra: {
          name: 'Cloud infrastructure',
          description: 'Hetzner, Coolify, GitHub Actions, R2 backups and Sentry: cheaper than managed cloud.',
        },
      },
      industries: {
        food: 'Food manufacturing',
        textile: 'Textile',
        retail: 'Retail (forecasting)',
        ai: 'AI',
        finance: 'Finance',
      },
    },
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
    readStory: 'See how I built it',
    storyBadge: 'Interactive story',
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
  story: {
    titleSuffix: 'Juan Otavalo',
    back: 'Experience',
    role: 'Role',
    location: 'Location',
    stack: 'Stack',
    storyLabel: 'Story',
    technical: {
      eyebrow: 'For recruiters',
      title: 'Technical details',
    },
    cta: {
      title: 'Does your plant have a similar problem?',
      text: 'If your production data lives in machines, paper sheets or systems that do not talk to each other, let’s talk.',
      schedule: 'Book a call',
      email: 'Email me',
      home: 'Back to home',
    },
    visuals: {
      machines: {
        aria: 'Diagram: four PLC-equipped machines (pellet mill, extruder, evaporator and silo) produce data that ends up on paper instead of reaching decision makers.',
        machines: ['Pellet mill', 'Extruder', 'Evaporator', 'Silo'],
        paper: 'Paper',
      },
      recipes: {
        aria: 'Diagram: a recipe breaks down into materials such as corn, barley and soy, each with its own yield; three teams collaborate: food, automation and software.',
        recipe: 'Recipe',
        materials: ['Corn', 'Barley', 'Soy'],
        people: ['Food', 'Automation', 'Software'],
      },
      pipeline: {
        aria: 'Plant diagram: pellet mill, extruder, evaporator and silo send data to a Siemens PLC server; the data is stored in Microsoft SQL Server, MongoDB and Redis, and reaches one single control computer.',
        machines: 'Machines',
        machineNames: ['Pellet mill', 'Extruder', 'Evaporator', 'Silo'],
        plc: 'PLC server',
        plcVendor: 'Siemens',
        databases: ['SQL Server', 'MongoDB', 'Redis'],
        computer: 'Control computer',
        computerSub: 'Flask · React',
      },
      command: {
        aria: 'Control room diagram: a wall of 6 screens lighting up one by one, each with a different chart: lines, bars, produced versus pending, yield, materials and recipe.',
        screens: ['Yield', 'Output', 'Shift', 'Material', 'Silos', 'Recipe'],
        produced: 'Produced',
        pending: 'Pending',
      },
      tenants: {
        aria: 'Diagram: feed plants for poultry, pigs, dogs and horses, each with its own recipes, connected to one shared dashboard.',
        plants: ['Poultry', 'Pigs', 'Dogs', 'Horses'],
        dashboard: 'Dashboard',
      },
    },
  },
};

export default en;
