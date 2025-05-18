// src/index.ts
import CssMinimizerWebpackPlugin from "css-minimizer-webpack-plugin";
import { reduceConfigs } from "reduce-configs";
var getCssnanoDefaultOptions = () => ({
  preset: [
    "default",
    {
      // merge longhand will break safe-area-inset-top, so disable it
      // https://github.com/cssnano/cssnano/issues/803
      // https://github.com/cssnano/cssnano/issues/967
      mergeLonghand: false
    }
  ]
});
function applyCSSMinimizer(chain, CHAIN_ID, options = {}) {
  const mergedOptions = reduceConfigs({
    initial: {
      minify: CssMinimizerWebpackPlugin.cssnanoMinify,
      minimizerOptions: getCssnanoDefaultOptions()
    },
    config: options.pluginOptions
  });
  chain.optimization.minimizer(CHAIN_ID.MINIMIZER.CSS).use(CssMinimizerWebpackPlugin, [
    mergedOptions
  ]).end();
}
var PLUGIN_CSS_MINIMIZER_NAME = "rsbuild:css-minimizer";
var pluginCssMinimizer = (options) => ({
  name: PLUGIN_CSS_MINIMIZER_NAME,
  setup(api) {
    api.modifyBundlerChain(async (chain, { CHAIN_ID, environment, isProd }) => {
      const { config } = environment;
      const { minify } = config.output;
      if (isProd && (minify === true || typeof minify === "object" && minify.css)) {
        applyCSSMinimizer(chain, CHAIN_ID, options);
      }
    });
  }
});
export {
  CssMinimizerWebpackPlugin,
  PLUGIN_CSS_MINIMIZER_NAME,
  applyCSSMinimizer,
  pluginCssMinimizer
};
