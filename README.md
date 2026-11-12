# commandesign.com

Sitio del estudio: Astro 5 + Tailwind CSS 4, estático, en español e inglés.

## Uso

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera /dist
```

## Estructura

```
src/
├─ data/                     ← TEXTOS Y DATOS (editables, ver CONTENIDO.md)
│  ├─ estudio.json           WhatsApp, correo, redes, ciudad
│  ├─ textos.es.json         Textos del sitio en español
│  └─ textos.en.json         Textos del sitio en inglés
├─ content/trabajos/         ← CASOS: es/<url>.md y en/<url>.md, emparejados por el campo url
├─ assets/trabajos/          ← FOTOS de los casos (Astro las optimiza)
├─ content.config.ts         Campos válidos de un caso
├─ lib/                      site.ts (datos, WhatsApp, países) · i18n.ts (rutas) · casos.ts · mapa-mundo.json (retícula del mapa)
├─ styles/global.css         Tokens (@theme): color, escala masiva ↔ micro, filetes, formulario, aparición
├─ scripts/motion.ts         Isotipo-engranaje, línea activa, lectura del manifiesto, recorrido, reloj, formulario y ficha
├─ layouts/Base.astro        <head>, SEO, hreflang, marco de la lámina
├─ components/
│  ├─ brand/                 Wordmark
│  ├─ ui/                    PixelSign (signo oficial), Isotipo (engranaje), SectionHead (encabezado de lámina), SplitTitle, botón
│  ├─ layout/                Header (menú discreto, línea activa) y Footer (firma: wordmark a todo el ancho)
│  ├─ home/                  Home.astro + Hero, Manifiesto, Services (índice), Mapa, ContactForm (con ficha en vivo)
│  └─ case/CasePage.astro    Plantilla de caso (oculta; se rediseña al volver los casos)
└─ pages/                    index · en/index · gracias · en/thanks · 404 (trabajos/[slug] y en/work/[slug] apagados con MOSTRAR_TRABAJOS)
```

## Edición

Panel Pages CMS configurado en `.pages.yml`: ver `CONTENIDO.md`.

## Sistema visual

Las reglas completas (color, tipografía, composición, movimiento, textos y stack) están en **`CLAUDE.md`**.
Resumen: negro industrial mate #0A0A0A, filetes de 1 px, titulares masivos en Mona Sans Bold (ancho normal)
contra micro-rótulos de plano, y el amarillo #FEF10C solo como punto de estado, línea activa o CTA principal.

## Pendiente antes de publicar

1. Confirmar el enlace de LinkedIn en `src/data/estudio.json`.
2. Fotos reales de los casos (en el panel o en `src/assets/trabajos/`).
3. El texto de cada caso.
4. Definir el caso 03.

## Publicación (Netlify)

1. Subir el proyecto a un repositorio de GitHub.
2. Netlify › Add new site › Import from Git. El `netlify.toml` ya define build y carpeta.
3. Netlify › Domain management › agregar `commandesign.com`.
4. En Squarespace › Dominios › DNS, cargar los registros que indique Netlify (habitualmente un `A` para `@` y un `CNAME` de `www` a `<sitio>.netlify.app`). Borrar antes los registros de Squarespace que apunten al sitio actual. **No tocar los MX ni los TXT de Google Workspace:** el correo sigue funcionando igual.

En Vercel es el mismo recorrido; el proyecto se detecta solo como Astro.
