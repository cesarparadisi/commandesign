import estudio from '../data/estudio.json';
import mapa from './mapa-mundo.json';

export type Lang = 'es' | 'en';
export const site = estudio;

/** Enlace a WhatsApp con el mensaje ya escrito (el mismo del enlace corto de la app). */
export const whatsappUrl = (lang: Lang, texto?: string) =>
  `https://wa.me/${estudio.whatsapp}?text=${encodeURIComponent(texto ?? estudio.mensajeWhatsApp[lang])}`;

/**
 * Número para mostrar. Argentina: 5491125148727 → +54 11 2514-8727 (el 9 solo lo necesita WhatsApp).
 * Otros países quedan como +<número>.
 */
export function whatsappVisible(n = estudio.whatsapp) {
  const m = n.match(/^549?(11|\d{3,4})(\d{6,8})$/);
  if (!m) return `+${n}`;
  const [, area, resto] = m;
  return `+54 ${area} ${resto.slice(0, resto.length - 4)}-${resto.slice(-4)}`;
}

/** https://instagram.com/commandesign → @commandesign */
export const instagramUsuario = (url = estudio.instagram) => `@${url.replace(/\/+$/, '').split('/').pop()}`;

/* ── Países con proyectos (mapa) ─────────────────────────────────────── */
export type Pais = (typeof mapa.paises)[number];
export const normalizar = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

/**
 * Lista de «paises» de estudio.json resuelta contra el mapa. Acepta el nombre en español o inglés,
 * o el código de dos letras. Un nombre que no se reconoce se avisa en el build y se omite.
 */
export function paisesConProyectos(): Pais[] {
  const out: Pais[] = [];
  for (const nombre of estudio.paises ?? []) {
    const k = normalizar(nombre);
    const p = mapa.paises.find((x) => normalizar(x.es) === k || normalizar(x.en) === k || x.iso.toLowerCase() === k);
    if (p) { if (!out.includes(p)) out.push(p); }
    else console.warn(`[mapa] País no reconocido en estudio.json › paises: «${nombre}». Opciones: ${mapa.paises.map((x) => x.es).join(', ')}`);
  }
  return out;
}
