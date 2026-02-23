import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import sharp from "sharp";
import exifr from "exifr";
import slugify from "slugify";

type SourceType = "manual" | "workflow" | "imported";

interface CLIOptions {
  input?: string;
  title?: string;
  description?: string;
  date?: string;
  tags?: string;
  location?: string;
  camera?: string;
  lens?: string;
  featured?: boolean;
  sourceType?: SourceType;
  sourceUrl?: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const contentDir = path.join(rootDir, "src/content/photos");
const assetsFullDir = path.join(rootDir, "src/assets/photos/fulls");
const assetsThumbDir = path.join(rootDir, "src/assets/photos/thumbs");
const publicFullDir = path.join(rootDir, "public/images/fulls");
const publicThumbDir = path.join(rootDir, "public/images/thumbs");

const parseArgs = (argv: string[]): CLIOptions => {
  const options: CLIOptions = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;

    const key = arg.slice(2);
    const next = argv[i + 1];

    if (key === "featured") {
      options.featured = true;
      continue;
    }

    if (!next || next.startsWith("--")) continue;
    i += 1;

    switch (key) {
      case "input":
        options.input = next;
        break;
      case "title":
        options.title = next;
        break;
      case "description":
        options.description = next;
        break;
      case "date":
        options.date = next;
        break;
      case "tags":
        options.tags = next;
        break;
      case "location":
        options.location = next;
        break;
      case "camera":
        options.camera = next;
        break;
      case "lens":
        options.lens = next;
        break;
      case "source-type":
        if (next === "manual" || next === "workflow" || next === "imported") {
          options.sourceType = next;
        }
        break;
      case "source-url":
        options.sourceUrl = next;
        break;
      default:
        break;
    }
  }

  return options;
};

const defaultTitleFromFilename = (filename: string): string =>
  filename
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toAperture = (value: unknown): string | undefined => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return undefined;
  return `f/${value.toFixed(1).replace(/\.0$/, "")}`;
};

const toShutter = (value: unknown): string | undefined => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return undefined;
  if (value >= 1) return `${value.toFixed(1).replace(/\.0$/, "")}s`;
  return `1/${Math.round(1 / value)}`;
};

const toFocalLength = (value: unknown): string | undefined => {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) return undefined;
  return `${Math.round(value)}mm`;
};

const resolveInputPath = (input: string): string => {
  if (path.isAbsolute(input)) return input;
  return path.resolve(rootDir, input);
};

const ensureDirectory = async (directory: string) => {
  await fs.mkdir(directory, { recursive: true });
};

const stripUndefined = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value.map((item) => stripUndefined(item)) as T;
  }

  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
      if (entry === undefined) return;
      result[key] = stripUndefined(entry);
    });
    return result as T;
  }

  return value;
};

const fileExists = async (filePath: string) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

const uniqueSlug = async (baseSlug: string) => {
  const stem = baseSlug || `photo-${Date.now()}`;
  let slug = stem;
  let suffix = 1;

  while (await fileExists(path.join(contentDir, `${slug}.md`))) {
    slug = `${stem}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  if (!args.input) {
    throw new Error("Missing --input argument. Example: bun run add-photo -- --input /path/to/image.jpg --title \"Evening Light\"");
  }

  const sourcePath = resolveInputPath(args.input);
  await fs.access(sourcePath);

  const parsedExif = await exifr.parse(sourcePath, {
    pick: [
      "Model",
      "LensModel",
      "FNumber",
      "ExposureTime",
      "ISO",
      "FocalLength",
      "DateTimeOriginal"
    ]
  });

  const title = args.title ?? defaultTitleFromFilename(path.basename(sourcePath));
  const slugBase = slugify(title, { lower: true, strict: true, trim: true });
  const slug = await uniqueSlug(slugBase);

  const captureDate = args.date
    ? new Date(args.date)
    : parsedExif?.DateTimeOriginal instanceof Date
      ? parsedExif.DateTimeOriginal
      : new Date();

  if (Number.isNaN(captureDate.getTime())) {
    throw new Error("Invalid --date value. Use ISO format such as 2026-02-23.");
  }

  const tags = args.tags
    ? args.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const sourceType: SourceType = args.sourceType ?? "manual";

  const fullAssetPath = path.join(assetsFullDir, `${slug}.jpg`);
  const thumbAssetPath = path.join(assetsThumbDir, `${slug}.jpg`);
  const fullPublicPath = path.join(publicFullDir, `${slug}.jpg`);
  const thumbPublicPath = path.join(publicThumbDir, `${slug}.jpg`);
  const contentPath = path.join(contentDir, `${slug}.md`);

  await Promise.all([
    ensureDirectory(contentDir),
    ensureDirectory(assetsFullDir),
    ensureDirectory(assetsThumbDir),
    ensureDirectory(publicFullDir),
    ensureDirectory(publicThumbDir)
  ]);

  const processor = sharp(sourcePath).rotate();

  await processor
    .clone()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(fullAssetPath);

  await processor
    .clone()
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(thumbAssetPath);

  await Promise.all([
    fs.copyFile(fullAssetPath, fullPublicPath),
    fs.copyFile(thumbAssetPath, thumbPublicPath)
  ]);

  const frontmatter: Record<string, unknown> = {
    title,
    description: args.description ?? "",
    publishedAt: captureDate.toISOString(),
    tags,
    location: args.location ?? "",
    camera: args.camera ?? parsedExif?.Model ?? "",
    lens: args.lens ?? parsedExif?.LensModel ?? "",
    featured: Boolean(args.featured),
    image: `../../assets/photos/fulls/${slug}.jpg`,
    thumbnail: `../../assets/photos/thumbs/${slug}.jpg`,
    settings: {
      aperture: toAperture(parsedExif?.FNumber) ?? "",
      shutter: toShutter(parsedExif?.ExposureTime) ?? "",
      iso: typeof parsedExif?.ISO === "number" ? Math.round(parsedExif.ISO) : undefined,
      focalLength: toFocalLength(parsedExif?.FocalLength) ?? ""
    },
    source: {
      type: sourceType,
      ...(args.sourceUrl ? { url: args.sourceUrl } : {})
    }
  };

  const markdown = matter.stringify("", stripUndefined(frontmatter));
  await fs.writeFile(contentPath, markdown, "utf8");

  // Keep output concise for local and CI logs.
  console.log(`Created photo entry: src/content/photos/${slug}.md`);
  console.log(`Generated images: src/assets/photos/fulls/${slug}.jpg and thumbs/${slug}.jpg`);
  console.log(`Public legacy paths: public/images/fulls/${slug}.jpg and thumbs/${slug}.jpg`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`add-photo failed: ${message}`);
  process.exit(1);
});
