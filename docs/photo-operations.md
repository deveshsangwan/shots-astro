# Photo Operations Guide

## 1) Add a photo from local file

```bash
bun run add-photo -- --input /absolute/path/to/image.jpg --title "My Shot"
```

Optional flags:

- `--description "..."`  
- `--date "2026-02-23"`  
- `--tags "street,night,city"`  
- `--location "New Delhi"`  
- `--camera "Sony A7 IV"`  
- `--lens "35mm"`  
- `--featured`  
- `--source-type manual|workflow|imported`  
- `--source-url "https://..."`  

## 2) Ingest from URL through GitHub

Use `Ingest photo` workflow (`workflow_dispatch`) and fill:

- `image_url` (required)
- optional metadata fields

The workflow will:

1. Download the image.
2. Run the same ingestion script used locally.
3. Commit generated metadata/assets to `main`.

## 3) Import old Jekyll images

If legacy files still exist under `images/fulls` and `images/thumbs`:

```bash
bun run import-legacy
```

## 4) Where files are written

- Metadata: `src/content/photos/*.md`
- Astro assets: `src/assets/photos/fulls` and `src/assets/photos/thumbs`
- Legacy path mirrors: `public/images/fulls` and `public/images/thumbs`

## 5) Verify after adding photos

```bash
bun run check
bun run build
bun run sync-pagefind
```
