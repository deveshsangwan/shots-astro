export const selectedPhotoIds = [
  "0403050423",
  "0407165722",
  "0124113922",
  "img20210223185350",
  "14",
  "img20210220185852-2",
  "0219181322",
  "16",
  "img20210221130806",
  "0616060922",
  "0210095922",
  "4"
] as const;

export function normalizeCameraName(value?: string) {
  const camera = value?.trim();
  if (!camera) return "";

  const normalized = camera.toLowerCase();
  if (normalized.includes("in2021")) return "OnePlus IN2021";
  if (normalized === "a6000" || normalized === "oneplus a6000") return "OnePlus A6000";
  if (normalized === "sony dsc-t90") return "Sony DSC-T90";
  if (normalized === "micromax a110q") return "Micromax A110Q";

  return camera;
}
