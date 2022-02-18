import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

const production = process.env.NODE_ENV === "production";
export default defineConfig({
  plugins: [
    svelte({
      emitCss: production,
      preprocess: sveltePreprocess(),
      compilerOptions: {
        dev: !production
      },
      hot: !production
    })
  ],
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: Infinity
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer()
      ]
    }
  }
})
