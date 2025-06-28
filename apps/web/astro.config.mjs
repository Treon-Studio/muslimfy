import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from '@tailwindcss/vite';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
    // add yur domain name here
   site: 'https://muslimfy.treonstudio.com',
  integrations: [sitemap(), react()]
});