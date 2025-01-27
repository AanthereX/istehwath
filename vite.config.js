import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    // Treat .js files in the `src` directory as JSX
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Transform with esbuild using JSX settings
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic', // Use React's JSX runtime
        });
      },
    },
    react(),
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Treat all .js files as JSX during dependency optimization
      },
    },
  },

  // Configure environment variables
  define: {
    'process.env': {}, // Prevent process.env usage errors
  },

  // Server settings (optional, based on use case)
  server: {
    port: 3000, // Default port for local development
    open: true, // Automatically open in browser
  },

  // Build settings (optional, based on production use case)
  build: {
    sourcemap: true, // Enable source maps for debugging
    outDir: 'dist', // Output directory
  },
});
