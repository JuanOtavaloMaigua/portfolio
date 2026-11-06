/** Spanish UI strings (default locale). en.ts must provide the same keys. */
const es = {
  meta: {
    title: 'Juan Otavalo — Full Stack Engineer en Ecuador',
    description:
      'ERPs a medida, trazabilidad RFID, datos industriales y agentes de IA para empresas en Ecuador y el mundo.',
    labTitle: 'Lab — Juan Otavalo',
    labDescription: 'Experimentos interactivos en 3D. Próximamente.',
    notFoundTitle: 'Página no encontrada — Juan Otavalo',
    notFoundDescription: 'La página que buscas no existe.',
  },
  a11y: {
    skipToContent: 'Saltar al contenido',
    mainNav: 'Navegación principal',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    toggleTheme: 'Cambiar entre tema claro y oscuro',
    language: 'Idioma',
    home: 'Juan Otavalo, inicio',
  },
  nav: {
    projects: 'Proyectos',
    experience: 'Experiencia',
    contact: 'Contacto',
  },
  hero: {
    title: 'Construyo el software que mueve industrias.',
    tagline: 'Full Stack Engineer · Ecuador · Django · React · TypeScript',
    ctaPrimary: 'Agendar una llamada',
    ctaSecondary: 'Escríbeme',
    network: {
      aria: 'Red de industrias y tecnologías con las que he construido software',
      listTitle: 'Industrias y tecnologías',
      summary: 'Un ingeniero, cinco industrias conectadas por las mismas tecnologías.',
      hint: 'Elige una industria o tecnología para ver sus conexiones.',
      storyLink: 'Ver historia',
      industries: {
        food: 'Alimentos',
        textile: 'Textil',
        retail: 'Retail (pronósticos)',
        ai: 'IA',
        finance: 'Finanzas',
      },
    },
  },
  projects: {
    eyebrow: '01 · Proyectos',
    title: 'Proyectos destacados',
    intro: 'Casos de estudio de sistemas en producción y en desarrollo.',
    problem: 'Problema',
    solution: 'Solución',
    result: 'Resultado',
    client: 'Cliente',
    tech: 'Tecnologías',
    status: {
      production: 'En producción',
      development: 'En desarrollo',
    },
  },
  experience: {
    eyebrow: '02 · Experiencia',
    title: 'Experiencia',
    present: 'Presente',
    readStory: 'Ver cómo lo construí',
    storyBadge: 'Historia interactiva',
  },
  process: {
    eyebrow: '03 · Proceso',
    title: 'Cómo trabajo',
    steps: [
      {
        title: 'Entender el negocio',
        text: 'Antes de escribir código, mapeo procesos, cuellos de botella y lo que realmente mueve la aguja.',
      },
      {
        title: 'Prototipo rápido',
        text: 'Una primera versión funcional en semanas, no meses, para validar con usuarios reales.',
      },
      {
        title: 'Despliegue en producción',
        text: 'Infraestructura simple y robusta, CI/CD y datos migrados sin detener la operación.',
      },
      {
        title: 'Mantenimiento y monitoreo',
        text: 'Backups, alertas y mejoras continuas para que el sistema siga funcionando cuando crece.',
      },
    ],
  },
  stack: {
    eyebrow: '04 · Stack',
    title: 'Stack',
    groups: {
      backend: 'Backend',
      frontend: 'Frontend',
      mobile: 'Móvil',
      data: 'Datos e IA',
      infra: 'Infra',
    },
  },
  contact: {
    eyebrow: '05 · Contacto',
    title: '¿Tienes un proyecto en mente?',
    text: 'Cuéntame qué necesitas y te respondo pronto.',
    email: 'Email',
    whatsapp: 'WhatsApp',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    schedule: 'Agendar llamada',
    sticky: 'Hablemos',
  },
  footer: {
    rights: 'Juan Otavalo',
    lab: 'Lab',
  },
  lab: {
    eyebrow: 'Lab',
    title: 'Próximamente',
    text: 'Un espacio para experimentos interactivos en 3D. Estoy trabajando en ello.',
    back: 'Volver al inicio',
  },
  notFound: {
    title: 'Página no encontrada',
    text: 'La página que buscas no existe o fue movida.',
    back: 'Volver al inicio',
  },
  story: {
    titleSuffix: 'Juan Otavalo',
    back: 'Experiencia',
    role: 'Rol',
    location: 'Ubicación',
    stack: 'Stack',
    storyLabel: 'Historia',
    technical: {
      eyebrow: 'Para reclutadores',
      title: 'Detalles técnicos',
    },
    cta: {
      title: '¿Tu planta tiene un problema parecido?',
      text: 'Si tus datos de producción viven en máquinas, hojas de papel o sistemas que no se hablan entre sí, conversemos.',
      schedule: 'Agendar una llamada',
      email: 'Escríbeme',
      home: 'Volver al inicio',
    },
    visuals: {
      machines: {
        aria: 'Diagrama: cuatro máquinas con PLC (peletizadora, extrusora, evaporador y silo) generan datos que terminan en papel en lugar de llegar a quien decide.',
        machines: ['Peletizadora', 'Extrusora', 'Evaporador', 'Silo'],
        paper: 'Papel',
      },
      recipes: {
        aria: 'Diagrama: una receta se descompone en materiales como maíz, cebada y soya, cada uno con su rendimiento; tres áreas colaboran: alimentos, automatización y software.',
        recipe: 'Receta',
        materials: ['Maíz', 'Cebada', 'Soya'],
        people: ['Alimentos', 'Automatización', 'Software'],
      },
      pipeline: {
        aria: 'Diagrama de la planta: peletizadora, extrusora, evaporador y silo envían datos a un servidor de PLC Siemens; los datos se guardan en Microsoft SQL Server, MongoDB y Redis, y llegan a un único computador de control.',
        machines: 'Máquinas',
        machineNames: ['Peletizadora', 'Extrusora', 'Evaporador', 'Silo'],
        plc: 'Servidor PLC',
        plcVendor: 'Siemens',
        databases: ['SQL Server', 'MongoDB', 'Redis'],
        computer: 'Computador de control',
        computerSub: 'Flask · React',
      },
      command: {
        aria: 'Diagrama de la sala de control: una pared de 6 pantallas que se encienden una a una, cada una con un gráfico distinto: líneas, barras, producido frente a pendiente, rendimiento, materiales y receta.',
        screens: ['Rendimiento', 'Producción', 'Turno', 'Material', 'Silos', 'Receta'],
        produced: 'Producido',
        pending: 'Pendiente',
      },
      tenants: {
        aria: 'Diagrama: plantas de alimento para pollos, cerdos, perros y caballos, cada una con sus recetas, conectadas a un mismo dashboard.',
        plants: ['Pollos', 'Cerdos', 'Perros', 'Caballos'],
        dashboard: 'Dashboard',
      },
    },
  },
};

export type Dictionary = typeof es;
export default es;
