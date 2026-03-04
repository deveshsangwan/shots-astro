import { getCollection } from "astro:content";

export async function GET() {
  const entries = await getCollection("photos").catch(() => []);
  const sorted = entries.sort(
    (a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()
  );

  const payload = sorted.map((entry) => ({
    id: entry.slug,
    title: entry.data.title,
    description: entry.data.description ?? "Untitled frame.",
    publishedAt: entry.data.publishedAt.toISOString(),
    location: entry.data.location ?? "",
    camera: entry.data.camera ?? "",
    lens: entry.data.lens ?? "",
    aperture: entry.data.settings?.aperture ?? "",
    shutter: entry.data.settings?.shutter ?? "",
    iso: entry.data.settings?.iso ? String(entry.data.settings.iso) : "",
    focalLength: entry.data.settings?.focalLength ?? "",
    fullSrc: entry.data.image.src
  }));

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  });
}
