

import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    manifest_version: 3, // Set this as an integer, not a string
  },
  modules: ["@wxt-dev/module-react"],
  webExt: {
    startUrls: ["https://google.com"],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
