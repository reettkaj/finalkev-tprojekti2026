import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        bmi: resolve(__dirname, 'bmi.html'),
        formit: resolve(__dirname, 'formit.html'),
        login: resolve(__dirname, 'login.html'),
        paivakirja: resolve(__dirname, 'paivakirja.html'),

        viikkotehtavat: resolve(
          __dirname,
          'viikkoharjoitukset/viikkotehtävät.html'
        ),
        flexbox: resolve(__dirname, 'viikkoharjoitukset/flexbox.html'),
        flexboxlayout: resolve(
          __dirname,
          'viikkoharjoitukset/flexbox-layout.html'
        ),
        rajapinnatv2: resolve(
          __dirname,
          'viikkoharjoitukset/rajapinnatv2.html'
        ),
        responsiivisuus: resolve(
          __dirname,
          'viikkoharjoitukset/responsiivisuus.html'
        ),
        treeni: resolve(__dirname, 'viikkoharjoitukset/treeni.html'),
      },
    },
  },
  base: './',
});