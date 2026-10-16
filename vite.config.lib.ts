import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: './tsconfig.lib.json',
      include: ['src'],
      exclude: ['src/**/*.stories.tsx', 'src/**/*.stories.module.css'],
      insertTypesEntry: true,
      rollupTypes: false,
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'CattleCareUI',
      formats: ['es'],
      fileName: 'index',
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: { react: 'React', 'react-dom': 'ReactDOM' },
        // Components use hooks and context, so React Server Components frameworks
        // (Next.js app router) must treat the whole bundle as client code.
        banner: "'use client';",
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
