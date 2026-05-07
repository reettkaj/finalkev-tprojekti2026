import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        ammattilaissivut: resolve(__dirname, 'ammattilaissivut.html'),
        asetukset: resolve(__dirname, 'asetukset.html'),
        etusivu: resolve(__dirname, 'etusivu.html'),
        hengitysharjoitus: resolve(__dirname, 'hengitysharjoitus.html'),
        hrv: resolve(__dirname, 'hrv.html'),
        kubios: resolve(__dirname, 'kubios.html'),
        paivakirja: resolve(__dirname, 'paivakirja.html'),
        profiili: resolve(__dirname, 'profiili.html'),
      },
    },
  },
  base: './',
});