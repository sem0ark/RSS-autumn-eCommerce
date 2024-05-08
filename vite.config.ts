import { defineConfig } from 'vite';

export default defineConfig({
  assetsInclude: ['**/*.svg', '**/*.mp3'],
  base: './',
  build: {
    outDir: './dist/',
    assetsDir: './assets/',
  },
  define: {
    global: {}
  },
  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
    },
  }
  // css: {
  //   modules: {
  //     localsConvention: 'camelCase',
  //     generateScopedName: '[local]_[hash:base64:2]',
  //   },
  // },
});
