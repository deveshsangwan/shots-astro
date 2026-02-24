import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const base =
    site?.toString().replace(/\/$/, "") ?? "https://deveshsangwan.github.io/shots-astro";
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
};
