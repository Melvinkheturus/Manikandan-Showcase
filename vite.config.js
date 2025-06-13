import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'three': resolve(__dirname, 'node_modules/three'),
    },
    dedupe: ['three', '@splinetool/runtime'],
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase/supabase-js') || id.includes('@supabase/postgrest-js')) {
              return 'supabase';
            }
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three') || id.includes('@splinetool')) {
              return 'three-fiber';
            }
            if (id.includes('framer-motion') || id.includes('gsap')) {
              return 'animation-libs';
            }
            if (id.includes('react-icons') || id.includes('react-intersection-observer') || id.includes('react-scroll-parallax')) {
              return 'vendors';
            }
            return 'vendor'; // all other third-party dependencies
          }
        }
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: [
      '@supabase/supabase-js', 
      '@supabase/postgrest-js', 
      'react', 
      'react-dom', 
      'react-router-dom', 
      'three',
      '@splinetool/runtime'
    ],
    esbuildOptions: {
      platform: 'browser',
      mainFields: ['module', 'main'],
    },
  },
  server: {
    open: true,
    host: true,
  },
})
