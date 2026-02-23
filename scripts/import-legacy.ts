import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const legacyFullDir = path.join(rootDir, "images/fulls");
const legacyThumbDir = path.join(rootDir, "images/thumbs");

const targetFullDir = path.join(rootDir, "src/assets/photos/fulls");
const targetThumbDir = path.join(rootDir, "src/assets/photos/thumbs");
const publicFullDir = path.join(rootDir, "public/images/fulls");
const publicThumbDir = path.join(rootDir, "public/images/thumbs");
const contentDir = path.join(rootDir, "src/content/photos");

const supportedExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const ensureDirectory = async (directory: string) => {
  await fs.mkdir(directory, { recursive: true });
};

const pathExists = async (targetPath: string) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const normalizeTitle = (filename: string) => {
  const normalized = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // Prevent YAML from inferring numeric IDs as numbers.
  if (/^\d+$/.test(normalized)) {
    return `Shot ${normalized}`;
  }

  return normalized;
};

const main = async () => {
  if (!(await pathExists(legacyFullDir))) {
    console.log("No legacy images/fulls directory found. Nothing to import.");
    return;
  }

  await Promise.all([
    ensureDirectory(targetFullDir),
    ensureDirectory(targetThumbDir),
    ensureDirectory(publicFullDir),
    ensureDirectory(publicThumbDir),
    ensureDirectory(contentDir)
  ]);

  const legacyFiles = await fs.readdir(legacyFullDir);
  let imported = 0;
  let skipped = 0;

  for (const file of legacyFiles) {
    const extension = path.extname(file).toLowerCase();
    if (!supportedExt.has(extension)) {
      skipped += 1;
      continue;
    }

    const sourceFull = path.join(legacyFullDir, file);
    const sourceThumb = path.join(legacyThumbDir, file);
    const hasThumb = await pathExists(sourceThumb);

    const slug = slugify(path.basename(file, extension), { lower: true, strict: true, trim: true });
    const metadataPath = path.join(contentDir, `${slug}.md`);
    if (await pathExists(metadataPath)) {
      skipped += 1;
      continue;
    }

    const fullTarget = path.join(targetFullDir, `${slug}.jpg`);
    const thumbTarget = path.join(targetThumbDir, `${slug}.jpg`);
    const fullPublic = path.join(publicFullDir, `${slug}.jpg`);
    const thumbPublic = path.join(publicThumbDir, `${slug}.jpg`);

    await fs.copyFile(sourceFull, fullTarget);
    if (hasThumb) {
      await fs.copyFile(sourceThumb, thumbTarget);
    } else {
      await fs.copyFile(sourceFull, thumbTarget);
    }
    await fs.copyFile(fullTarget, fullPublic);
    await fs.copyFile(thumbTarget, thumbPublic);

    const stat = await fs.stat(sourceFull);
    const title = normalizeTitle(file);
    const frontmatter = {
      title,
      description: "",
      publishedAt: stat.mtime.toISOString(),
      tags: [],
      location: "",
      camera: "",
      lens: "",
      featured: false,
      image: `../../assets/photos/fulls/${slug}.jpg`,
      thumbnail: `../../assets/photos/thumbs/${slug}.jpg`,
      settings: {
        aperture: "",
        shutter: "",
        focalLength: ""
      },
      source: {
        type: "imported"
      }
    };

    await fs.writeFile(metadataPath, matter.stringify("", frontmatter), "utf8");
    imported += 1;
  }

  console.log(`Legacy import complete. Imported: ${imported}, skipped: ${skipped}`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`import-legacy failed: ${message}`);
  process.exit(1);
});
