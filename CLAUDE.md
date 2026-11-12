# CLAUDE.md · commandesign.com

Reglas permanentes para cualquier trabajo en este repositorio. Son **no negociables**: si un pedido
las contradice, señalarlo antes de escribir código. El objetivo es un sitio de estudio de nivel
internacional (Wolff Olins / editorial industrial), nunca una interfaz genérica tipo SaaS.

---

## 1. Dirección de arte: «lámina industrial»

El sitio es una lámina técnica: soporte negro mate, filetes de 1 px, titulares masivos y micro-rótulos
de plano. Cada sección es una lámina numerada (01 Portada · 02 Manifiesto · 03 Servicios · 04 Mapa ·
05 Contacto) y el pie es la firma: el wordmark a todo el ancho.

### Color
| Token | Hex | Uso |
|---|---|---|
| `negro` | `#0A0A0A` | Soporte. Fondo de todo el sitio, mate, con grano (`body::after`). |
| `grafito` / `carbon` | `#111111` / `#161616` | Solo estados (selector elegido). Nunca como bloque de sección. |
| `filete` / `filete-fuerte` | `#1F1F1F` / `#2E2E2E` | Filetes de 1 px (separadores horizontales). |
| `acero` | `#4D4D4D` | Solo decorativo (casillas, separadores). **Nunca texto.** |
| `humo` | `#6E6E6E` | Segunda frase de un titular grande, placeholders. |
| `cemento` | `#8C8C8C` | Micro-rótulos (6,2:1). |
| `niebla` | `#B5B5B0` | Texto de lectura secundario (10:1). |
| `blanco` | `#F4F4F2` | Texto principal (18:1). |
| `senal` | `#FEF10C` | **Quirúrgico.** Ver abajo. |

**Amarillo señal: solo en dosis quirúrgicas.** Usos permitidos, y ningún otro:
1. **Punto de estado**: «Agenda abierta», sección activa en el menú, ficha «Lista para enviar», frente de la trama del recorrido, puntos de países en el mapa, filete superior de la ficha de un país.
2. **Línea activa de 1 px**: progreso de lectura bajo la cabecera, fila activa del índice, campo con foco o error.
3. **CTA principal**: el botón amarillo (uno por pantalla: portada y ficha del formulario).

**Prohibido:** fondos o secciones amarillas, texto amarillo largo, logo en amarillo, iconos amarillos,
degradés con amarillo. Selección de texto en amarillo está permitida (es un estado).

### Tipografía (solo Mona Sans, autoalojada en `/public/fonts`)
- **Titulares:** utilidad `titular` = **Bold 700, ancho normal** (la proporción del wordmark), tracking
  cerrado (−0,03 a −0,045 em, ya incluido en `text-mega`, `text-display`, `text-headline`, `text-index`).
  Decisión del estudio (nov 2026): los titulares de la web van en Bold; subtítulos y preguntas del
  formulario también en Bold. **Nunca Black (900) ni ancho expandido.** El cuerpo sigue en Regular/Medium.
- **Claim de portada:** cada frase entra en **una línea** en escritorio, en español y en inglés.
  `--text-mega` = ancho de la lámina ÷ 15 (la frase más larga mide 14,7 em). Si el claim cambia,
  medir y ajustar ese divisor.
- **Micro-rótulos de plano:** utilidad `micro` = 11 px, Medium, mayúsculas, espaciado 0,14 em.
  Para números de lámina, códigos (`S·01`), hora y rumbo, sumar `lectura` (cifras tabulares,
  con el cero cruzado propio del dibujo técnico). En la prosa, cifras normales.
- **Lectura:** `text-small` (15 px) en `niebla`; manifiesto en `text-statement` Medium.
- El contraste masivo ↔ micro es la jerarquía. No agregar tamaños intermedios sin necesidad.
- Cero tipografías de sistema visibles, cero Inter/Roboto/Helvetica de reemplazo.

### Composición
- Retícula `shell` (máx. 1440 px, márgenes 20/40 px) + `grid-cmd` (4 columnas en móvil, 12 desde 768 px).
  Todo se alinea a columnas; los rótulos de una fila comparten línea base (`items-baseline`).
- Espacio negativo generoso: secciones con `pt-32 md:pt-48`. No rellenar huecos.
- Filetes de 1 px (`h-px bg-filete` o `border-filete`). Esquinas **rectas** siempre.
- Cada sección empieza con `SectionHead`: filete que se traza, número + nombre a la izquierda, nota técnica a la derecha, titular condensado.
- Marco fijo de 1 px alrededor de la ventana (borde de la lámina, en `Base.astro`).
- **Sin coordenadas geográficas** en ninguna parte (portada, pie ni imagen para redes).
- **Sin cajas.** Nada de bloques rectangulares con borde (tarjetas, cajetines, cuadros de íconos):
  la información se ordena con **filetes horizontales de 1 px** y espacio. Los únicos rectángulos son el
  botón amarillo y los selectores del formulario.
- **Pie:** filete, el **wordmark a todo el ancho** (sin el isotipo) y una sola línea (© · claim · volver arriba).
  Sin contacto, idioma ni escala: el contacto está justo arriba y el idioma en la cabecera.
- **Sin información repetida:** cada dato aparece en un solo lugar (contacto en Contacto, países en el Mapa,
  tiempo de respuesta en la nota de Contacto).

### Prohibido (señales de interfaz genérica)
Píldoras y botones redondeados · tarjetas con sombra o borde redondeado · degradés decorativos ·
glassmorphism · iconos de librería · emojis · ilustraciones stock · contadores animados · carruseles ·
«hero» centrado con subtítulo y dos botones · cursores personalizados · efectos magnéticos ·
textos tipo «soluciones integrales», «llevamos tu marca al siguiente nivel».

---

## 2. Marca

- **Signo oficial «del píxel al punto»**: 152 celdas de la retícula 15 × 15 (`src/lib/signo-celdas.json`).
  En la columna i: k = i/14 · lado = 0,9 − 0,08k · radio = k·lado/2. No redibujar ni simplificar.
  Componentes: `ui/PixelSign.astro` (estático) e `ui/Isotipo.astro` (la «brújula» de la portada: el signo
  en un dial de 120 dientes que gira con el scroll; su lectura se llama «Rumbo»). No quitar la brújula.
- Logo **siempre acromático** (blanco sobre negro). Nunca amarillo, nunca con efectos.
- Claim de portada: «Dirección creativa y ejecución. De la pantalla a la calle.»
  Claim de marca (manifiesto y pie): «Diseñado para construirse.»
- Evitar cruces «+» como ornamento.

## 3. Textos

- Siempre de cara al cliente: voz «nosotros». **Español neutro con tuteo**, como se habla en Venezuela
  (cuéntanos, escríbenos, elige, tienes, apruebas), **nunca voseo** (contanos, escribinos, elegí, tenés).
  Vocabulario neutro: vitrinas (no vidrieras), letreros (no cartelería), aquí (no acá). Inglés natural en `/en`.
  Nada que suene a nota interna, reglas numeradas dirigidas al dueño ni rótulos sin función.
- Palabras prohibidas: branding, 360, soluciones integrales, siguiente nivel, pasión, magia,
  gracias por la confianza, presupuesto sin compromiso, económico, barato.
- Todo texto visible vive en `src/data/textos.es.json` / `textos.en.json` (nada de texto fijo en componentes,
  salvo marcas como «WhatsApp»). Las dos versiones deben tener las mismas claves.

### Contacto en el sitio
- Los canales se muestran **como íconos** (componente `ui/Canales.astro`): WhatsApp, Instagram, X y teléfono.
  Un clic lleva directo al canal. **No escribir el número, el correo ni los usuarios como texto** en el cuerpo
  ni en el pie: solo aparecen dentro de los íconos (etiqueta accesible y tooltip).
- El estudio es **@commandesign en todas las redes**; el pie lo dice una sola vez («En todas las redes como @commandesign»).
- Los íconos aparecen **una sola vez**: «Canales directos» en Contacto, sin caja (al pasar, aparece debajo un píxel amarillo que se vuelve punto).
- Registro: profesional y preciso (pilares Exacto, Con criterio, Técnico traducido, Sobrio). Frases completas,
  sin coloquialismos («Iniciar un proyecto», «Próximos pasos», «Enviamos una propuesta formal…»).

## 4. Movimiento (`src/scripts/motion.ts`)

Cada movimiento tiene una función. Un solo bucle `requestAnimationFrame` que se duerme en reposo.
- **Engranaje:** el isotipo gira con el scroll (0,16°/px) con inercia; el dial contragira a la mitad; la lectura «Rumbo» muestra el ángulo.
- **Línea activa:** progreso amarillo de 1 px bajo la cabecera; punto amarillo en la sección activa del menú.
- **Lectura:** las palabras del manifiesto se encienden al pasar (`[data-lectura]`, variable `--r`).
- **Recorrido (animación del píxel al punto):** trama de 4 × 48 celdas (24 en el teléfono) en el manifiesto.
  Con el scroll, un frente amarillo la recorre de izquierda a derecha: delante quedan píxeles grises
  (pantalla), detrás puntos blancos (calle). Enciende Pantalla, Taller y Calle al llegar a cada columna.
  Es CSS puro sobre `--q` (`[data-recorrido]`); sin JavaScript queda en puntos.
- **Mapa:** las columnas aparecen de oeste a este y los países con proyectos se encienden después. Sin lista de
  países: al pasar por un país se aísla; al hacer **clic** en su punto o en sus celdas se abre su ficha
  (nombre + proyectos hechos allí, enlazados a cada caso). Los proyectos salen de los casos publicados con el
  campo `pais`; mientras no haya, la ficha dice «Casos de estudio en preparación». En el teléfono la ficha
  se abre debajo del mapa.
- **Aparición:** `data-reveal` (sube), `data-reveal="filete"` (se traza), `data-reveal="titular"` (palabras por máscara), `data-reveal="mapa"`.
- Curvas: `--ease-precisa` (0.2, 0, 0, 1). Duraciones 0,6–1,6 s. Nada de rebotes.
- `prefers-reduced-motion`: todo en estado final, sin giro.

## 5. Contenido que se mantiene solo

El sitio no debe necesitar republicarse por el paso del tiempo ni por cambios de datos simples:
- **Año** del pie: lo pone el navegador (`[data-anio]`). **Hora y huso** de Buenos Aires: en vivo.
- **Países con proyectos:** `src/data/estudio.json › paises` (panel: Datos del estudio). Alimenta el mapa,
  y los datos estructurados de Google. Nombres válidos y
  geometría en `src/lib/mapa-mundo.json` (retícula de 2,5° del manual, Natural Earth). Un nombre desconocido
  se avisa en el build y se omite. El primero de la lista es la sede.
- **WhatsApp y teléfono:** un solo número en `estudio.json` (formato `549` + área + número). Lo usan el
  enlace de WhatsApp y el ícono de teléfono (`tel:`); en texto, solo en la etiqueta accesible (`+54 11 XXXX-XXXX`).
- **Redes:** `instagram`, `x` (y `linkedin`, opcional) en `estudio.json`; alimentan los íconos y los datos para Google.
- **Estado** de la portada («Agenda abierta»): si el texto queda vacío, la celda desaparece.
- Servicios, opciones del formulario y textos: todo en los JSON; ningún número de «cantidad» escrito a mano.
- Datos estructurados (`ProfessionalService`) en `Base.astro`, armados desde `estudio.json`.

## 6. Stack

- **Astro 5** (estático, `build.format: 'file'`, sin ClientRouter) + **Tailwind CSS 4** (`@tailwindcss/vite`, tokens en `@theme` de `src/styles/global.css`).
- i18n: español en la raíz, inglés en `/en` (`src/lib/i18n.ts`).
- **Pages CMS** (`.pages.yml`): edita `textos.*.json`, `estudio.json` y los casos. **Regla:** cada clave
  nueva en los JSON se agrega también en `.pages.yml`, o el panel la borra al guardar.
- **Netlify** (`netlify.toml`) + Netlify Forms (form `contacto`, honeypot `bot-field`, envío sin recarga con
  `fetch('/')`, `action` a `/gracias` sin JavaScript). Dominio con DNS en Squarespace: no tocar MX ni TXT.
- Casos de estudio ocultos: `MOSTRAR_TRABAJOS = false` en `src/lib/casos.ts`. Al reactivarlos, rediseñar
  `CaseCard`, `SoonCard`, `WorkGrid` y `CasePage` con este sistema antes de publicar.

## 7. Antes de dar algo por terminado

```bash
npx astro check   # 0 errores, 0 advertencias
npm run build     # limpio
```
Revisar en navegador a 1440 × 900 y 390 × 844: sin desborde horizontal, el claim entra en una línea
por frase en escritorio (ES y EN), el mapa muestra los países de `estudio.json`, el formulario envía y la
ficha pasa a «Lista para enviar». Validar que `.pages.yml` cubra todas las claves de los JSON.
