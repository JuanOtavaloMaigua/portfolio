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
    avatarAlt: 'Foto de Juan Otavalo',
    home: 'Juan Otavalo, inicio',
  },
  nav: {
    projects: 'Proyectos',
    experience: 'Experiencia',
    contact: 'Contacto',
  },
  hero: {
    title: 'Construyo el software que mueve industrias.',
    subtitle:
      'ERPs a medida, trazabilidad RFID, datos industriales y agentes de IA para empresas en Ecuador y el mundo.',
    tagline: 'Full Stack Engineer · Ecuador · Django · React · TypeScript',
    ctaPrimary: 'Agendar una llamada',
    ctaSecondary: 'Escríbeme',
    availability: 'Disponible para nuevos proyectos',
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
};

export type Dictionary = typeof es;
export default es;
