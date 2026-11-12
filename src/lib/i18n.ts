import es from '../data/textos.es.json';
import en from '../data/textos.en.json';
import type { Lang } from './site';

export type Textos = typeof es;
const textos: Record<Lang, Textos> = { es, en };
export const getTextos = (lang: Lang) => textos[lang];

/** URL públicas por idioma: español en la raíz, inglés bajo /en. */
export const rutas = {
  es: { inicio: '/', trabajos: '/trabajos', gracias: '/gracias' },
  en: { inicio: '/en', trabajos: '/en/work', gracias: '/en/thanks' },
} as const;

export const otro = (lang: Lang): Lang => (lang === 'es' ? 'en' : 'es');
export const rutaCaso = (lang: Lang, slug: string) => `${rutas[lang].trabajos}/${slug}`;
export const rutaAlterna = (lang: Lang, slug?: string) => (slug ? rutaCaso(otro(lang), slug) : rutas[otro(lang)].inicio);
export const ancla = (lang: Lang, id: string) => `${lang === 'es' ? '' : '/en'}/#${id}`;
export const pad = (n: number) => String(n).padStart(2, '0');
