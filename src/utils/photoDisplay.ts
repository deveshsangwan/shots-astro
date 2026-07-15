const FILELIKE_TITLE_PATTERN = /^(img|dsc|lrm export|lrmexport|pxl|vid)\b/i;
const LONG_NUMBER_PATTERN = /\d{8,}/;

export function getPhotoDisplayTitle(title: string, fallbackIndex?: number): string {
  const cleaned = title.trim().replace(/[_-]+/g, " ").replace(/\s+/g, " ");

  if (!cleaned || /^\d+$/.test(cleaned) || FILELIKE_TITLE_PATTERN.test(cleaned) || LONG_NUMBER_PATTERN.test(cleaned)) {
    return typeof fallbackIndex === "number"
      ? `Frame ${String(fallbackIndex + 1).padStart(2, "0")}`
      : "Untitled frame";
  }

  return cleaned
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/(\d)([A-Za-z])/g, "$1 $2");
}

export function hasDisplayValue(value: string | null | undefined): boolean {
  return Boolean(value && value.trim() && value.trim() !== "-");
}
