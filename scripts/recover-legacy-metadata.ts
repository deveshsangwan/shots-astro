import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import exifr from "exifr";
import matter from "gray-matter";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const contentDir = path.join(rootDir, "src/content/photos");

const legacyArgIndex = process.argv.findIndex((arg) => arg === "--legacy");
const legacyRoot = legacyArgIndex >= 0 && process.argv[legacyArgIndex + 1]
  ? path.resolve(process.argv[legacyArgIndex + 1])
  : path.resolve(rootDir, "../shots");

const legacyFullDir = path.join(legacyRoot, "images/fulls");
const supportedExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const slugForFile = (file: string) =>
  slugify(path.basename(file, path.extname(file)), { lower: true, strict: true, trim: true });

const dateFromFilename = (file: string) => {
  const basename = path.basename(file, path.extname(file));
  const match = basename.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
  if (!match) return null;

  const [, month, day, hour, minute, year] = match.map(Number);
  const date = new Date(Date.UTC(2000 + year, month - 1, day, hour, minute));
  return Number.isNaN(date.getTime()) ? null : date;
};

const toDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatCamera = (make?: unknown, model?: unknown) => {
  const cameraMake = typeof make === "string" ? make.trim() : "";
  const cameraModel = typeof model === "string" ? model.trim() : "";

  if (!cameraMake) return cameraModel;
  if (!cameraModel) return cameraMake;
  if (cameraModel.toLowerCase().startsWith(cameraMake.toLowerCase())) return cameraModel;

  return `${cameraMake} ${cameraModel}`;
};

const ratioToNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return null;
  const [rawNumerator, rawDenominator] = value.split("/").map(Number);
  if (!rawDenominator) return Number.isFinite(rawNumerator) ? rawNumerator : null;
  return rawNumerator / rawDenominator;
};

const formatAperture = (value: unknown) => {
  const aperture = ratioToNumber(value);
  return aperture ? `f/${Number(aperture.toFixed(1))}` : "";
};

const formatFocalLength = (value: unknown) => {
  const focalLength = ratioToNumber(value);
  return focalLength ? `${Number(focalLength.toFixed(2))}mm` : "";
};

const formatShutter = (value: unknown) => {
  if (typeof value === "string" && value.includes("/")) return value;
  const shutter = ratioToNumber(value);
  if (!shutter) return "";
  if (shutter < 1) return `1/${Math.round(1 / shutter)}`;
  return `${Number(shutter.toFixed(2))}s`;
};

const main = async () => {
  const files = await fs.readdir(legacyFullDir);
  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    if (!supportedExt.has(path.extname(file).toLowerCase())) {
      skipped += 1;
      continue;
    }

    const slug = slugForFile(file);
    const contentPath = path.join(contentDir, `${slug}.md`);
    try {
      await fs.access(contentPath);
    } catch {
      skipped += 1;
      continue;
    }

    const imagePath = path.join(legacyFullDir, file);
    const metadata = (await exifr.parse(imagePath, {
      exif: true,
      gps: true,
      iptc: true,
      xmp: true
    })) ?? {};

    const raw = await fs.readFile(contentPath, "utf8");
    const parsed = matter(raw);
    const data = parsed.data;
    const capturedAt = toDate(metadata.DateTimeOriginal ?? metadata.CreateDate ?? metadata.ModifyDate ?? metadata.DateTime)
      ?? dateFromFilename(file);
    const camera = formatCamera(metadata.Make, metadata.Model);

    if (capturedAt) data.publishedAt = capturedAt.toISOString();
    if (camera) data.camera = camera;
    if (metadata.LensModel) data.lens = String(metadata.LensModel);

    data.settings = {
      ...(data.settings ?? {}),
      aperture: formatAperture(metadata.FNumber ?? metadata.ApertureValue) || data.settings?.aperture || "",
      shutter: formatShutter(metadata.ExposureTime ?? metadata.ShutterSpeedValue) || data.settings?.shutter || "",
      iso: metadata.ISO ?? metadata.PhotographicSensitivity ?? data.settings?.iso,
      focalLength: formatFocalLength(metadata.FocalLength) || data.settings?.focalLength || ""
    };

    if (!data.settings.iso) delete data.settings.iso;

    await fs.writeFile(contentPath, matter.stringify(parsed.content, data), "utf8");
    updated += 1;
  }

  console.log(`Recovered metadata from ${legacyFullDir}`);
  console.log(`Updated: ${updated}, skipped: ${skipped}`);
};

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`recover-legacy-metadata failed: ${message}`);
  process.exit(1);
});
