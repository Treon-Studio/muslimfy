"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  CssMinimizerWebpackPlugin: () => import_css_minimizer_webpack_plugin.default,
  PLUGIN_CSS_MINIMIZER_NAME: () => PLUGIN_CSS_MINIMIZER_NAME,
  applyCSSMinimizer: () => applyCSSMinimizer,
  pluginCssMinimizer: () => pluginCssMinimizer
});
module.exports = __toCommonJS(src_exports);
var import_css_minimizer_webpack_plugin = __toESM(require("css-minimizer-webpack-plugin"), 1);
var import_reduce_configs = require("reduce-configs");
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
  const mergedOptions = (0, import_reduce_configs.reduceConfigs)({
    initial: {
      minify: import_css_minimizer_webpack_plugin.default.cssnanoMinify,
      minimizerOptions: getCssnanoDefaultOptions()
    },
    config: options.pluginOptions
  });
  chain.optimization.minimizer(CHAIN_ID.MINIMIZER.CSS).use(import_css_minimizer_webpack_plugin.default, [
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CssMinimizerWebpackPlugin,
  PLUGIN_CSS_MINIMIZER_NAME,
  applyCSSMinimizer,
  pluginCssMinimizer
});
