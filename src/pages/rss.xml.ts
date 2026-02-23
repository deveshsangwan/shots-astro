import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "@/config/site";

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, "") ?? siteConfig.url;
  const photos = await getCollection("photos");
  const sorted = photos.sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());

  const items = sorted
    .map((photo) => {
      const url = `${base}/photo/${photo.slug}/`;
      const title = escapeXml(photo.data.title);
      const description = escapeXml(photo.data.description ?? "");
      const pubDate = new Date(photo.data.publishedAt).toUTCString();
      return `<item><title>${title}</title><link>${url}</link><guid>${url}</guid><description>${description}</description><pubDate>${pubDate}</pubDate></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteConfig.title)}</title>
  <link>${base}</link>
  <description>${escapeXml(siteConfig.description)}</description>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
};
