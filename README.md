# Shots

Modern photography portfolio built with Astro.

## Stack

- Astro + Tailwind CSS
- File-based content collections (`src/content/photos`)
- Responsive optimized images (`src/assets/photos`)
- Static search index with Pagefind
- GitHub Pages deployment via Actions

## Requirements

- Bun 1.3+

If Bun is not installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

## Local Development

```bash
bun install
bun run dev
```

## Project Structure

- `src/pages/` - routes (`/`, `/about`, `/photo/[slug]`, feeds/SEO endpoints)
- `src/components/` - gallery, lightbox, shared UI
- `src/content/photos/` - photo metadata markdown
- `src/assets/photos/` - optimized full/thumb images for Astro
- `public/images/` - mirrored full/thumb images for legacy URL continuity
- `scripts/add-photo.ts` - ingestion pipeline for new photos
- `scripts/import-legacy.ts` - one-time migration from old `images/` folders

## Add a New Photo

```bash
bun run add-photo -- \
  --input /absolute/path/to/image.jpg \
  --title "Golden Hour Street" \
  --description "Late evening in Old Delhi" \
  --tags "street,evening,city" \
  --location "New Delhi" \
  --featured
```

What this does:

1. Reads EXIF metadata where available.
2. Generates optimized full and thumb JPEGs.
3. Copies images into Astro assets and legacy public image paths.
4. Creates a content entry in `src/content/photos`.

## Import Legacy Jekyll Images

If you still have old files in `images/fulls` and `images/thumbs`:

```bash
bun run import-legacy
```

This creates metadata entries and copies assets into the new Astro structure.

## Build and Preview

```bash
bun run check
bun run build
bun run preview
```

After build, generate/update search index:

```bash
bun run sync-pagefind
```

## Deployment

- Production deployment is handled by `.github/workflows/deploy-astro.yml`.
- On push to `main`, Actions builds and deploys `dist/` to GitHub Pages.
- Current live URL: `https://shots.deveshsangwan.com/`.
- Custom domain is configured via `public/CNAME`.

Manual ingestion from URL is available through `.github/workflows/ingest-photo.yml` (`workflow_dispatch`).

## Design System

Design direction and token rules are documented in `docs/design-system.md`.