import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        officer: resolve(__dirname, 'officer.html'),
        lawyer: resolve(__dirname, 'lawyer.html'),
        judge: resolve(__dirname, 'judge.html'),
        admin: resolve(__dirname, 'admin.html')
      }
    }
  }
});
