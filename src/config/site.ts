/**
 * Site-wide constants.
 */
export const SITE = {
  name: 'Juan Otavalo',
  url: 'https://juanotavalo.dev',
  jobTitle: 'Full Stack Engineer',
  email: 'juanotavalomaigua@gmail.com',
  /** WhatsApp number in international format: country code + number, no +, spaces or national leading 0. */
  whatsappNumber: '593984787185',
  linkedinUrl: 'https://www.linkedin.com/in/juan-otavalo-44258aa9/',
  githubUrl: 'https://github.com/JuanOtavaloMaigua',
  ogImage: '/og.png',
} as const;

/** WhatsApp click-to-chat link with a prefilled message (pass the localized `contact.whatsappMessage`). */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
