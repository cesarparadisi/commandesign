import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Casos de estudio: un archivo por idioma, emparejados por el campo `url`.
 *   src/content/trabajos/es/<archivo>.md   →  /trabajos/<url>
 *   src/content/trabajos/en/<archivo>.md   →  /en/work/<url>
 *   src/assets/trabajos/                   →  imágenes (Astro las optimiza)
 * Se editan desde Pages CMS (.pages.yml) o a mano. Agregar un archivo suma el caso a la cuadrícula.
 */
const trabajos = defineCollection({
  loader: glob({ pattern: '{es,en}/*.md', base: './src/content/trabajos' }),
  schema: ({ image }) =>
    z.object({
      url: z.string().regex(/^[a-z0-9-]+$/, 'url: solo minúsculas, números y guiones'),
      title: z.string(),
      client: z.string().default(''),
      order: z.number().int(),
      status: z.enum(['publicado', 'proximamente']).default('publicado'),
      focus: z.string().default(''),
      summary: z.string().default(''),
      scope: z.array(z.string()).default([]),
      place: z.string().default(''),
      pais: z.string().default(''),
      year: z.number().int().optional(),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    }),
});

export const collections = { trabajos };
