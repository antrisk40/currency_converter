import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
// Resolve current file path (ESM-safe)
var __file = fileURLToPath(import.meta.url);
var __dir = dirname(__file);
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dir, './src'),
            '@services': resolve(__dir, './src/services'),
            '@components': resolve(__dir, './src/components'),
            '@data': resolve(__dir, './src/data')
        },
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
        watch: {
            usePolling: true
        }
    }
});
// Support __dirname in ESM (used by some tooling)
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
