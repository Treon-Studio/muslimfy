import { defineConfig } from '@rsbuild/core';

import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  tools: {
    rspack: (config) => {
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.json$/,
        type: 'asset/resource',
      });
      return config;
    },
  },
  plugins: [pluginReact()],
  server: {
    publicDir: [
      {
        name: './build/web',
      },
    ],
  },
  source: {
    entry: {
      index: './client',
    },
  },
  dev: {
    watchFiles: {
      paths: ['./build/web/main.web.bundle'],
      type: 'reload-page',
    },
  },
  output: {
    assetPrefix: '/',
    distPath: {
      root: './build/client',
    },
  },
  html: {
    title: 'LynxJS Web',
    favicon: './src/assets/favicon.ico',
  },
});
