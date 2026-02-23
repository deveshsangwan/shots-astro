# Deployment Runbook (Astro + GitHub Pages)

## Branch and Environment

- Primary branch: `main`
- Deploy workflow: `.github/workflows/deploy-astro.yml`
- Host target: GitHub Pages with custom domain `shots.deveshsangwan.com`

## Pre-Deploy Checklist

1. Verify Bun runtime locally:
   - `bun --version` (ensure Bun 1.3+)
2. Validate:
   - `bun run check`
   - `bun run build`
   - `bun run sync-pagefind`
3. Verify at least one content entry exists in `src/content/photos`.
4. Confirm `public/CNAME` contains correct domain.

## Cutover Steps

1. Push changes to `main`.
2. Wait for `Deploy Astro portfolio` workflow to pass.
3. Verify production routes:
   - `/`
   - `/about`
   - `/photo/<slug>/`
   - `/sitemap-index.xml`
   - `/robots.txt`
   - `/rss.xml`
4. Run Lighthouse smoke checks on homepage and a photo detail page.

## Rollback Strategy

If production breaks:

1. Revert the last commit(s) on `main`.
2. Re-run the deploy workflow (automatic on push).
3. If needed, redeploy last known good commit from GitHub UI.

Keep a migration snapshot tag for safe fallback, for example:

```bash
git tag jekyll-snapshot
git push origin jekyll-snapshot
```

## Workflow References

- Deploy: `.github/workflows/deploy-astro.yml`
- Manual ingestion from URL: `.github/workflows/ingest-photo.yml`
