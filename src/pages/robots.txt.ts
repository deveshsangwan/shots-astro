import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base =
    site?.toString().replace(/\/$/, "") ?? "https://shots.deveshsangwan.com";
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
