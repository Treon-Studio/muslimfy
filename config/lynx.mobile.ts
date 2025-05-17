import { defineConfig } from '@lynx-js/rspeedy';

import { customPlugins } from './lynx.js';

const mobileEnvironment = {
  lynx: {},
};

export default defineConfig({
  plugins: customPlugins,
  environments: mobileEnvironment,
});
