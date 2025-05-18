import { defineConfig } from '@lynx-js/rspeedy';

import { customPlugins } from './lynx.js';

const webEnvironment = {
  web: {
    output: {
      assetPrefix: '/',
      distPath: {
        root: './build/web',
      },
    },
  },
};

export default defineConfig({
  plugins: customPlugins,
  environments: webEnvironment,
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
});
