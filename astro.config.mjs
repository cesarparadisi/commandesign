// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://commandesign.com',
  trailingSlash: 'never',
  // Con el ClientRouter las páginas se precargan al pasar el cursor; los casos, al entrar en pantalla
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  build: { format: 'file' },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    // Español en la raíz (/trabajos/...), inglés con prefijo (/en/work/...)
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es', en: 'en' } },
      filter: (page) => !/\/(gracias|thanks)$/.test(page.replace(/\/$/, '')),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
