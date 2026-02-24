# Migration Notes: Jekyll to Astro

## What changed

- Replaced Jekyll templates with Astro routes/components.
- Replaced jQuery/Poptrox interaction model with modern vanilla lightbox interaction.
- Replaced GraphicsMagick/Gulp image flow with Sharp-based ingestion script.
- Replaced issue-comment automation with explicit `workflow_dispatch` ingestion.
- Introduced structured photo metadata with Astro content collections.

## URL continuity

- Portfolio home remains at `/`.
- Legacy image URLs are preserved via generated copies in `public/images/fulls` and `public/images/thumbs`.
- New detail pages are available at `/photo/<slug>/`.

## Legacy files status

Legacy Jekyll runtime files have been removed from `main`.
Rollback history is preserved in your separate legacy branch.

## First production validation pass

1. Homepage and gallery filter behavior
2. Lightbox keyboard/swipe navigation
3. Photo detail page SEO metadata
4. `robots.txt`, `rss.xml`, and `sitemap-index.xml`
5. Deployment and custom domain resolution
