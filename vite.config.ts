import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.svg', '**/*.mp3'],
  base: './',
  build: {
    outDir: './dist/',
    assetsDir: './assets/',
  },
  // css: {
  //   modules: {
  //     localsConvention: 'camelCase',
  //     generateScopedName: '[local]_[hash:base64:2]',
  //   },
  // },
});
