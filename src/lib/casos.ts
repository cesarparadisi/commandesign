import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from './site';

export type Caso = CollectionEntry<'trabajos'>;

/**
 * Casos ocultos esta semana: la página no muestra la cuadrícula y no se generan las páginas de casos.
 * El contenido sigue editable en el panel. Para volver a mostrarlos: true (y adaptar las
 * tarjetas al campo amarillo, que hoy conservan el diseño sobre negro).
 */
export const MOSTRAR_TRABAJOS = false;

/** El campo `url` de la ficha es la dirección del caso y empareja español con inglés. */
export const slugDe = (c: Caso) => c.data.url;

/** Un caso se publica cuando su status es "publicado" y tiene portada. */
export const esPublicado = (c: Caso) => c.data.status === 'publicado' && Boolean(c.data.cover);

/** Todos los casos de un idioma, en el orden de la cuadrícula. */
export async function getCasos(lang: Lang) {
  const casos = await getCollection('trabajos', (e) => e.id.startsWith(`${lang}/`));
  return casos.sort((a, b) => a.data.order - b.data.order);
}
