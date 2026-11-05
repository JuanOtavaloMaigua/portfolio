/**
 * Minimal client behavior shared by every page:
 * theme toggle, mobile menu, scroll reveal and the sticky mobile contact button.
 */

type Theme = 'light' | 'dark';

function setupThemeToggle(): void {
  const root = document.documentElement;
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');

  const sync = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(isDark)));
  };

  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const next: Theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage can be unavailable (private mode, blocked cookies); the toggle still works for this page.
      }
      sync();
    }),
  );

  // Follow system changes only while the user has not chosen explicitly.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('theme');
    } catch {
      stored = null;
    }
    if (stored !== 'light' && stored !== 'dark') {
      root.setAttribute('data-theme', event.matches ? 'dark' : 'light');
      sync();
    }
  });

  sync();
}

function setupMobileMenu(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-menu-button]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!button || !panel) return;

  const openLabel = button.dataset.labelOpen ?? '';
  const closeLabel = button.dataset.labelClose ?? '';

  const setOpen = (open: boolean) => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? closeLabel : openLabel);
    panel.hidden = !open;
  };

  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
  window.matchMedia('(min-width: 768px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
}

function setupReveal(): void {
  const elements = document.querySelectorAll<HTMLElement>('.reveal');
  if (elements.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );

  elements.forEach((el) => observer.observe(el));
}

function setupStickyContact(): void {
  const sticky = document.querySelector<HTMLElement>('[data-sticky-contact]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  const contact = document.querySelector<HTMLElement>('#contact');
  if (!sticky || !hero || !('IntersectionObserver' in window)) return;

  let heroVisible = true;
  let contactVisible = false;

  const update = () => {
    const show = !heroVisible && !contactVisible;
    sticky.dataset.visible = String(show);
    sticky.inert = !show;
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.target === hero) heroVisible = entry.isIntersecting;
      if (entry.target === contact) contactVisible = entry.isIntersecting;
    });
    update();
  });

  observer.observe(hero);
  if (contact) observer.observe(contact);
  update();
}

setupThemeToggle();
setupMobileMenu();
setupReveal();
setupStickyContact();
