# Cómo editar el sitio

## Opción recomendada: panel de edición (Pages CMS)

Un panel web, gratis, para cambiar textos y fotos sin tocar código. Funciona con el repositorio de GitHub: cada vez que guardas, Netlify vuelve a publicar el sitio en más o menos un minuto.

### Activarlo (una sola vez, con el sitio ya en GitHub y Netlify)
1. Entra en https://app.pagescms.org y haz clic en «Sign in with GitHub».
2. Instala la app de Pages CMS en tu cuenta de GitHub y dale acceso al repositorio `commandesign-web`.
3. Abre el repositorio en el panel. La configuración ya viene en el archivo `.pages.yml`.

### Qué encontrarás en el panel
| Sección | Qué cambia |
|---|---|
| Textos · español / Textos · inglés | Portada (claim en dos frases, estado «Agenda abierta» —si lo dejas vacío, se oculta—, rótulos de datos), manifiesto (texto, etapas pantalla/taller/calle y frase de cierre), índice de servicios, mapa, contacto (canales, horario y «Próximos pasos»), **formulario** (opciones de «¿Qué necesitas?» y «¿Para cuándo?») y su ficha en vivo, botones y pie. |
| Datos del estudio | WhatsApp (también se usa para el ícono de teléfono), mensaje predeterminado, correo, Instagram, X, LinkedIn y **países con proyectos** (uno por línea; el primero es la sede). Al agregar un país, se ilumina solo en el mapa. |
| Casos · español / inglés (ocultos) | Los casos se pueden preparar aquí; por ahora no se muestran en el sitio. |

### Casos ocultos
La página funciona como carta de presentación, sin casos. Para volver a mostrarlos hay que cambiar `MOSTRAR_TRABAJOS` a `true` en `src/lib/casos.ts` y rediseñar las tarjetas con el sistema de `CLAUDE.md` (pídemelo y lo hago).

### Formulario
Las consultas llegan a Netlify (Forms › contacto) y por correo a hello@ si activaste la notificación (ver DEPLOY.md). Las opciones de necesidades y plazos se editan en Textos › Formulario de contacto.

### Agregar un caso
1. Casos · español › «Add an entry».
2. Completa los campos. En **Dirección (url)** escribe el nombre corto del proyecto en minúsculas y con guiones (`miss-market`).
3. En **País (para el mapa)** escribe el país tal como figura en Datos del estudio (p. ej. `Argentina`). Así el caso aparece al hacer clic en ese país del mapa.
4. Sube la portada (horizontal, 4:3, 1600 × 1200 o más) y guarda.
5. Haz lo mismo en Casos · inglés con **la misma Dirección (url)**: así el botón EN/ES une las dos versiones.

### Estados de un caso
- **publicado**: aparece en la cuadrícula con su foto y tiene página propia. Necesita portada.
- **proximamente**: muestra la ficha técnica «Próximo lanzamiento» y no tiene página. Sirve para reservar un lugar o esconder un caso sin borrarlo.

La cuadrícula se ordena por **Posición en la cuadrícula** (1, 2, 3…) y los casos se acomodan solos en la composición.

## Opción manual (editando archivos)

| Archivo | Qué cambia |
|---|---|
| `src/data/textos.es.json` / `textos.en.json` | Textos del sitio |
| `src/data/estudio.json` | Datos del estudio |
| `src/content/trabajos/es/*.md` / `en/*.md` | Casos (ficha arriba, texto abajo) |
| `src/assets/trabajos/` | Fotos de los casos |
