import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const photos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/photos" }),
  schema: ({ image }) =>
    z.object({
      title: z.coerce.string(),
      description: z.string().optional(),
      publishedAt: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      location: z.string().optional(),
      camera: z.string().optional(),
      lens: z.string().optional(),
      featured: z.boolean().default(false),
      image: image(),
      thumbnail: image().optional(),
      settings: z
        .object({
          aperture: z.string().optional(),
          shutter: z.string().optional(),
          iso: z.number().int().positive().optional(),
          focalLength: z.string().optional()
        })
        .optional(),
      source: z
        .object({
          type: z.enum(["manual", "workflow", "imported"]).default("manual"),
          url: z.url().optional()
        })
        .optional()
    })
});

export const collections = {
  photos
};
