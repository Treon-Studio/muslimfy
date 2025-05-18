import { defineConfig } from '@rsbuild/core';

import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
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
  output: {
    assetPrefix: './',
    distPath: {
      root: './build/app',
    },
    copy: [{ from: './src/assets/favicon.ico' }],
  },
  html: {
    title: 'LynxJS App',
  },
});
