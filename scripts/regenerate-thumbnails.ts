import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import sharp from "sharp";

interface CLIOptions {
  width: number;
  quality: number;
  dryRun: boolean;
}

interface PhotoFrontmatter {
  image?: string;
  thumbnail?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const contentDir = path.join(rootDir, "src/content/photos");
const publicThumbDir = path.join(rootDir, "public/images/thumbs");

const defaultOptions: CLIOptions = {
  width: 800,
  quality: 78,
  dryRun: false
};

const parseArgs = (argv: string[]): CLIOptions => {
  const options: CLIOptions = { ...defaultOptions };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith("--")) continue;
    index += 1;

    if (arg === "--width") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed > 0) options.width = parsed;
      continue;
    }

    if (arg === "--quality") {
      const parsed = Number.parseInt(next, 10);
      if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 100) options.quality = parsed;
    }
  }

  return options;
};

const pathExists = async (targetPath: string) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const resolveFromEntry = (entryPath: string, relativePath: string) =>
  path.resolve(path.dirname(entryPath), relativePath);

const ensureDirectory = async (directory: string) => {
  await fs.mkdir(directory, { recursive: true });
};

const main = async () => {
  const options = parseArgs(process.argv.slice(2));
  const entries = await fs.readdir(contentDir);
  const markdownFiles = entries.filter((file) => file.endsWith(".md"));

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  if (!options.dryRun) {
    await ensureDirectory(publicThumbDir);
  }

  for (const file of markdownFiles) {
    const entryPath = path.join(contentDir, file);

    try {
      const source = await fs.readFile(entryPath, "utf8");
      const { data } = matter(source);
      const frontmatter = data as PhotoFrontmatter;

      if (!frontmatter.image || !frontmatter.thumbnail) {
        skipped += 1;
        continue;
      }

      const fullImagePath = resolveFromEntry(entryPath, frontmatter.image);
      const thumbnailPath = resolveFromEntry(entryPath, frontmatter.thumbnail);

      if (!(await pathExists(fullImagePath))) {
        skipped += 1;
        continue;
      }

      if (options.dryRun) {
        console.log(`[dry-run] ${path.relative(rootDir, thumbnailPath)}`);
        processed += 1;
        continue;
      }

      await ensureDirectory(path.dirname(thumbnailPath));
      await sharp(fullImagePath)
        .rotate()
        .resize({ width: options.width, withoutEnlargement: true })
        .jpeg({ quality: options.quality, mozjpeg: true })
        .toFile(thumbnailPath);

      const publicThumbPath = path.join(publicThumbDir, path.basename(thumbnailPath));
      await fs.copyFile(thumbnailPath, publicThumbPath);
      processed += 1;
    } catch (error) {
      failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`Failed for ${file}: ${message}`);
    }
  }

  console.log(
    `Regeneration complete. Processed: ${processed}, skipped: ${skipped}, failed: ${failed}, dryRun: ${options.dryRun}`
  );
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`regenerate-thumbnails failed: ${message}`);
  process.exit(1);
});
