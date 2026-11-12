/**
 * commandesign · movimiento · «lámina industrial»
 *
 * Todo el movimiento tiene una función y corre en un solo bucle de requestAnimationFrame,
 * que se duerme cuando no hay nada que mover.
 *  · Engranaje: el isotipo gira con el scroll, con inercia mecánica; el dial contragira a la mitad
 *    y la lectura «Giro» muestra el ángulo.
 *  · Línea activa: el filete de la cabecera se carga en amarillo según el avance de la página;
 *    la sección que estás leyendo se marca con un punto amarillo en el menú.
 *  · Lectura: las palabras del manifiesto se encienden a medida que pasan por la pantalla.
 *  · Recorrido: la trama pasa del píxel al punto (de la pantalla a la calle) y enciende cada etapa.
 *  · Aparición: filetes que se trazan y titulares que suben palabra por palabra.
 *  · Mapa: las columnas aparecen de oeste a este y los países con proyectos se encienden;
 *    al pasar por un país se aísla y al hacer clic se abre su ficha con los proyectos hechos allí.
 *  · Formulario: validación, envío a Netlify sin recargar y ficha de la consulta en vivo.
 *  · Datos vivos: hora de Buenos Aires con su huso, y el año del pie (no hace falta republicar en enero).
 * Con «reducir movimiento» todo queda en su estado final y el isotipo no gira.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

let vh = innerHeight;
let raf = 0;

/* ── Engranaje ─────────────────────────────────────────────────────── */
const GRADOS_POR_PX = 0.16; // una vuelta completa cada ~2250 px de scroll
let giro = 0;
let giroObjetivo = 0;
let rot: HTMLElement | null = null;
let ring: SVGGElement | null = null;
let lecturaGiro: HTMLElement | null = null;

function pintarGiro() {
  if (rot) rot.style.transform = `rotate(${giro.toFixed(2)}deg)`;
  if (ring) ring.style.transform = `rotate(${(-giro * 0.5).toFixed(2)}deg)`;
  if (lecturaGiro) {
    const a = ((giro % 360) + 360) % 360;
    lecturaGiro.textContent = `${a.toFixed(1).padStart(5, '0')}°`;
  }
}

/* ── Línea activa y lectura ───────────────────────────────────────── */
let barra: HTMLElement | null = null;
let lecturas: HTMLElement[] = [];
let recorrido: HTMLElement | null = null;
let etapas: HTMLElement[] = [];

function porScroll() {
  const max = document.documentElement.scrollHeight - vh;
  barra?.style.setProperty('--p', (max > 0 ? clamp(scrollY / max) : 0).toFixed(4));

  for (const el of lecturas) {
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const v = reduce.matches ? 2 : clamp(((vh * 0.9 - r.top) / (vh * 0.4 + r.height)) * 1.15, 0, 1.15);
    el.style.setProperty('--r', v.toFixed(4));
  }

  if (recorrido) {
    const r = recorrido.getBoundingClientRect();
    // El frente recorre la trama mientras el bloque sube del 90 % al 30 % de la pantalla
    const q = reduce.matches ? 2 : clamp((vh * 0.9 - r.top) / (vh * 0.6)) * 1.15;
    recorrido.style.setProperty('--q', q.toFixed(4));
    // cada etapa se enciende cuando el frente llega a su columna (4 de 12)
    etapas.forEach((e, i) => e.classList.toggle('is-on', q >= i * 0.32));
  }
}

function frame() {
  raf = 0;
  porScroll();
  if (rot) {
    const d = giroObjetivo - giro;
    giro = Math.abs(d) < 0.01 ? giroObjetivo : giro + d * 0.085;
    pintarGiro();
    if (giro !== giroObjetivo) kick();
  }
}
function kick() { if (!raf) raf = requestAnimationFrame(frame); }

function onScroll() {
  if (!reduce.matches) giroObjetivo = scrollY * GRADOS_POR_PX;
  kick();
}

/* ── Sección activa en el menú ────────────────────────────────────── */
function seccionActiva() {
  const links = [...document.querySelectorAll<HTMLAnchorElement>('[data-nav]')];
  const secciones = [...document.querySelectorAll<HTMLElement>('[data-sheet]')];
  if (!links.length || !secciones.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const id = (e.target as HTMLElement).dataset.sheet;
      links.forEach((l) => l.setAttribute('aria-current', String(l.dataset.nav === id)));
    }
  }, { rootMargin: '-45% 0px -54% 0px' });
  secciones.forEach((s) => io.observe(s));
}

/* ── Aparición ───────────────────────────────────────────────────── */
function aparicion() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduce.matches || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  els.forEach((e) => io.observe(e));
}

/* ── Reloj de Buenos Aires y año ──────────────────────────────────── */
function reloj() {
  const anio = String(new Date().getFullYear());
  document.querySelectorAll<HTMLElement>('[data-anio]').forEach((e) => (e.textContent = anio));
  const els = document.querySelectorAll<HTMLTimeElement>('[data-clock]');
  if (!els.length) return;
  const tz = els[0].dataset.tz || 'America/Argentina/Buenos_Aires';
  const fmt = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: tz });
  try {
    // Huso real (por si cambia el horario de verano): «GMT-3» → «UTC−3»
    const off = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(new Date()).find((x) => x.type === 'timeZoneName')?.value;
    if (off) document.querySelectorAll<HTMLElement>('[data-utc]').forEach((e) => (e.textContent = off.replace('GMT', 'UTC').replace('-', '−') || 'UTC'));
  } catch { /* navegadores viejos: queda el valor impreso */ }
  const tick = () => { const s = fmt.format(new Date()); els.forEach((e) => (e.textContent = s)); };
  tick();
  setInterval(tick, 1000);
}

/* ── Mapa: foco por país ───────────────────────────────────────────── */
function mapaFoco() {
  const fig = document.querySelector<HTMLElement>('[data-mapa]');
  if (!fig) return;
  const fijar = () => fig.classList.add('fijo');
  if (reduce.matches || !('IntersectionObserver' in window)) fijar();
  else {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { io.disconnect(); setTimeout(fijar, 2600); }
    }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(fig);
  }
  const fichas = [...fig.querySelectorAll<HTMLElement>('[data-ficha-pais]')];
  const botones = [...fig.querySelectorAll<HTMLButtonElement>('.marca')];
  let abierto: string | undefined;
  const foco = (iso?: string) => { fijar(); const v = iso ?? abierto; if (v) fig.dataset.foco = v; else delete fig.dataset.foco; };
  const abrir = (iso?: string) => {
    abierto = iso && iso !== abierto ? iso : undefined;
    fichas.forEach((f) => (f.hidden = f.dataset.fichaPais !== abierto));
    botones.forEach((b) => b.setAttribute('aria-expanded', String(b.dataset.pais === abierto)));
    foco();
  };
  // Pasar por un país lo aísla; hacer clic en su punto o en sus celdas abre su ficha
  fig.addEventListener('pointerover', (e) => {
    const iso = (e.target as Element).closest<HTMLElement | SVGElement>('[data-pais]')?.dataset.pais;
    if (iso) foco(iso);
  });
  fig.addEventListener('pointerout', (e) => {
    const desde = (e.target as Element).closest('[data-pais]');
    const hacia = (e.relatedTarget as Element | null)?.closest?.('[data-pais]');
    if (desde && !hacia) foco();
  });
  fig.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement | SVGElement>('[data-pais]');
    if (el?.dataset.pais) { e.stopPropagation(); abrir(el.dataset.pais); }
  });
  document.addEventListener('click', (e) => {
    if (abierto && !(e.target as Element).closest('[data-ficha-pais]')) abrir();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierto) abrir(); });
}

/* ── Menú móvil: se cierra al elegir una sección ─────────────────── */
function menu() {
  document.querySelectorAll<HTMLDetailsElement>('details[data-menu]').forEach((d) => {
    d.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => (d.open = false)));
  });
}

/* ── Formulario + ficha en vivo ──────────────────────────────────── */
function formulario() {
  const form = document.querySelector<HTMLFormElement>('form[data-form]');
  if (!form) return;
  const box = form.parentElement!;
  const success = box.querySelector<HTMLElement>('[data-form-success]')!;
  const errorBox = form.querySelector<HTMLElement>('[data-form-error]')!;
  const btn = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
  const btnLabel = btn.querySelector<HTMLElement>('[data-btn-label]')!;
  const tags = form.querySelector<HTMLElement>('[data-tags]')!;
  const lang = form.dataset.lang ?? 'es';
  const nombre = form.querySelector<HTMLInputElement>('#f-nombre')!;
  const empresa = form.querySelector<HTMLInputElement>('#f-empresa')!;
  const correo = form.querySelector<HTMLInputElement>('#f-correo')!;
  const telefono = form.querySelector<HTMLInputElement>('#f-telefono')!;

  const necesidades = () => [...form.querySelectorAll<HTMLInputElement>('input[name=necesidad]:checked')].map((i) => i.value);
  const plazo = () => form.querySelector<HTMLInputElement>('input[name=plazo]:checked')?.value ?? '';
  const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const show = (id: string, on: boolean) => { const el = form.querySelector<HTMLElement>(`#${id}`); if (el) el.hidden = !on; };

  // Ficha de la consulta: refleja lo que se va completando
  const ficha = (id: string) => form.querySelector<HTMLElement>(`[data-ficha="${id}"]`);
  const estado = form.querySelector<HTMLElement>('[data-ficha-estado]');
  const estadoTexto = form.querySelector<HTMLElement>('[data-ficha-estado-texto]');
  const set = (el: HTMLElement | null, v: string) => {
    if (!el) return;
    el.textContent = v || form.dataset.vacio || '—';
    el.toggleAttribute('data-vacio', !v);
  };
  const actualizarFicha = () => {
    set(ficha('servicios'), necesidades().join(' · '));
    set(ficha('marca'), empresa.value.trim());
    set(ficha('contacto'), [nombre.value.trim(), correo.value.trim(), telefono.value.trim()].filter(Boolean).join('\n'));
    set(ficha('plazo'), plazo());
    const listo = necesidades().length > 0 && nombre.value.trim().length > 1 && emailOk(correo.value);
    estado?.toggleAttribute('data-listo', listo);
    if (estadoTexto) estadoTexto.textContent = (listo ? form.dataset.listo : form.dataset.incompleto) ?? '';
  };
  ficha('contacto')?.style.setProperty('white-space', 'pre-line');
  form.addEventListener('input', actualizarFicha);
  form.addEventListener('change', actualizarFicha);
  actualizarFicha();

  const checks = {
    necesidades: () => { const ok = necesidades().length > 0; tags.setAttribute('aria-invalid', String(!ok)); show('err-necesidades', !ok); return ok; },
    nombre: () => { const ok = nombre.value.trim().length > 1; nombre.setAttribute('aria-invalid', String(!ok)); show('err-nombre', !ok); return ok; },
    correo: () => { const ok = emailOk(correo.value); correo.setAttribute('aria-invalid', String(!ok)); show('err-correo', !ok); return ok; },
  };
  nombre.addEventListener('blur', () => nombre.value && checks.nombre());
  correo.addEventListener('blur', () => correo.value && checks.correo());
  nombre.addEventListener('input', () => nombre.getAttribute('aria-invalid') === 'true' && checks.nombre());
  correo.addEventListener('input', () => correo.getAttribute('aria-invalid') === 'true' && checks.correo());
  tags.addEventListener('change', () => tags.getAttribute('aria-invalid') === 'true' && checks.necesidades());

  const setState = (s: 'idle' | 'sending') => {
    form.dataset.state = s;
    btn.disabled = s === 'sending';
    btnLabel.textContent = (s === 'sending' ? btn.dataset.labelSending : btn.dataset.labelIdle) ?? '';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.hidden = true;
    const r = [checks.necesidades(), checks.nombre(), checks.correo()];
    if (r.includes(false)) {
      const first = !r[0] ? form.querySelector<HTMLInputElement>('input[name=necesidad]') : !r[1] ? nombre : correo;
      first?.focus({ preventScroll: true });
      first?.closest('fieldset')?.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    const lista = necesidades();
    form.querySelector<HTMLInputElement>('[data-necesidades]')!.value = lista.join(', ');
    const data = new URLSearchParams();
    new FormData(form).forEach((v, k) => { if (k !== 'necesidad') data.append(k, String(v)); });

    setState('sending');
    try {
      let ok = false;
      if ((window as unknown as { __CMD_PREVIEW?: boolean }).__CMD_PREVIEW) {
        await new Promise((res) => setTimeout(res, 900)); // vista previa: el envío real lo recibe Netlify
        ok = true;
      } else {
        const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
        ok = res.ok;
      }
      if (!ok) throw new Error('envio');
      const wa = success.querySelector<HTMLAnchorElement>('[data-success-whatsapp]');
      if (wa) {
        const resumen = lang === 'es'
          ? `Hola commandesign, soy ${nombre.value.trim()}. Les acabo de escribir por la web: ${lista.join(', ')}.`
          : `Hi commandesign, this is ${nombre.value.trim()}. I just wrote to you through the website: ${lista.join(', ')}.`;
        wa.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(resumen)}`;
      }
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
      box.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'start' });
    } catch {
      errorBox.textContent = form.dataset.msgEnvio ?? '';
      errorBox.hidden = false;
    } finally {
      setState('idle');
    }
  });

  box.querySelector('[data-form-reset]')?.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.setAttribute('aria-invalid', 'false'));
    actualizarFicha();
    success.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input[name=necesidad]')?.focus();
  });
}

/* ── Arranque ─────────────────────────────────────────────────────── */
function init() {
  rot = document.querySelector<HTMLElement>('[data-gear-rot]');
  ring = document.querySelector<SVGGElement>('[data-gear-ring]');
  lecturaGiro = document.querySelector<HTMLElement>('[data-gear-out]');
  barra = document.querySelector<HTMLElement>('[data-progress]');
  lecturas = [...document.querySelectorAll<HTMLElement>('[data-lectura]')];
  recorrido = document.querySelector<HTMLElement>('[data-recorrido]');
  etapas = [...document.querySelectorAll<HTMLElement>('[data-etapa]')];

  // El isotipo arranca en el ángulo que corresponde al scroll actual (al recargar a mitad de página)
  giroObjetivo = giro = reduce.matches ? 0 : scrollY * GRADOS_POR_PX;
  pintarGiro();

  aparicion();
  seccionActiva();
  reloj();
  mapaFoco();
  menu();
  formulario();

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { vh = innerHeight; kick(); }, { passive: true });
  reduce.addEventListener('change', () => { giroObjetivo = reduce.matches ? 0 : scrollY * GRADOS_POR_PX; kick(); });
  kick();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
