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

export async function getStaticPaths() {
  const photos = await getCollection("photos");
  return photos.map((photo) => ({
    params: { slug: photo.slug },
    props: {
      title: photo.data.title,
      subtitle: photo.data.description || siteConfig.subtitle
    }
  }));
}

export const GET: APIRoute = ({ props }) => {
  const title = escapeXml(props.title as string);
  const subtitle = escapeXml(props.subtitle as string);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111217"/>
      <stop offset="100%" stop-color="#252632"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="160" cy="315" r="74" fill="#f6b460" opacity="0.88"/>
  <text x="270" y="255" fill="#a3a3b2" font-size="34" font-family="Inter,Arial,sans-serif">Photography by Devesh Sangwan</text>
  <text x="270" y="348" fill="#f3f4f6" font-size="74" font-family="Georgia,serif">${title}</text>
  <text x="270" y="412" fill="#d4d4dc" font-size="30" font-family="Inter,Arial,sans-serif">${subtitle}</text>
  <text x="270" y="476" fill="#f6b460" font-size="26" font-family="Inter,Arial,sans-serif">${siteConfig.url}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
};
