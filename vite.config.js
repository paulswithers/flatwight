// filepath: /vite.config.js
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  root: '', // Set the root directory
  server: {
    https: true, // Enable HTTPS
  },
  plugins: [mkcert()], // Use mkcert plugin
});