# juanotavalo.dev

Personal portfolio and services landing page. Astro 5 (static output), TypeScript strict, Tailwind CSS v4, native i18n (Spanish at `/`, English at `/en/`).

## Run locally

Requires Node 20.3+ (Astro 5). Astro 6+ needs Node 22.12+, see "Upgrading" below.

```bash
npm install
npm run dev        # http://localhost:4321
npm run check      # type-check .astro/.ts files
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

## Edit projects and experience

Content lives in Markdown frontmatter, one folder per language. Keep the same file name in both folders.

```
src/content/projects/es/textile-erp.md
src/content/projects/en/textile-erp.md
src/content/experience/es/intivest.md
src/content/experience/en/intivest.md
```

- Projects: `title`, `context`, `problem`, `solution`, `result`, `tech` (list), `status` (`production` | `development`), `order`, `featured`, and an optional `client` (shown only when set).
- Experience: `company`, `role`, `location`, `start` (e.g. `2025-01-01`), optional `end` (omit for "Present"), `summary`, `order`.

The schemas are in `src/content.config.ts`; a build fails with a clear message if a field is missing or invalid.

UI text (buttons, headings, process steps, labels) lives in `src/i18n/es.ts` and `src/i18n/en.ts`. The stack badges are in `src/data/stack.ts`.

## Placeholders to replace

| What | Where |
| --- | --- |
| Cal.com booking link | `calUrl` in `src/config/site.ts` |
| WhatsApp number (`wa.me/593...`) | `whatsappUrl` in `src/config/site.ts` |
| Avatar | `src/assets/avatar.jpg` (optimized by `<Image>`) and `public/avatar.jpg` (used in JSON-LD) |
| Open Graph image (1200×630) | `public/og.png` |

## Change the accent color

Edit `--color-accent` in `src/styles/global.css`: once in the `@theme static` block (light mode) and once in the `[data-theme="dark"]` block (dark mode, use a lighter tone). `--color-on-accent` is the text color used on accent buttons. Keep a contrast ratio of at least 4.5:1 for both pairs (check with any WCAG contrast tool). The favicon color is in `public/favicon.svg`.

## Deploy to Coolify

1. Push the repository to GitHub.
2. In Coolify: **New Resource → Public/Private Repository**, pick the repo and branch.
3. Build Pack: **Dockerfile** (the root `Dockerfile` is detected automatically).
4. Ports Exposes: **80**.
5. Set the domain to `https://juanotavalo.dev` and deploy. Coolify's proxy handles TLS.

The Dockerfile builds with `node:22-alpine` and serves `dist/` with `nginx:alpine` using `nginx.conf` (gzip, 1-year immutable cache for `/_astro/`, clean URLs for `/en/` and `/lab/`, custom `404.html`).

Test the image locally:

```bash
docker build -t juanotavalo-dev .
docker run --rm -p 8080:80 juanotavalo-dev   # http://localhost:8080
```

## Architecture notes

- `src/components/lab/LabCanvas.tsx` is a placeholder React island hydrated with `client:visible` on `/lab`. Replace it with a React Three Fiber `<Canvas>` later; React only ships on pages that use an island.
- Client JS on the home page is a single small module (`src/scripts/main.ts`): theme toggle, mobile menu, scroll reveal and sticky mobile CTA.

## Upgrading

This project pins Astro 5 because Astro 6+ requires Node 22.12 or newer. To upgrade, install Node 22 LTS locally and run `npx @astrojs/upgrade`.
