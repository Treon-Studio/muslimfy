import { RspackChain, ChainIdentifier, RsbuildPlugin } from '@rsbuild/core';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
export { default as CssMinimizerWebpackPlugin } from 'css-minimizer-webpack-plugin';
import { ConfigChain } from 'reduce-configs';

type CssMinimizerPluginOptions = CssMinimizerPlugin.BasePluginOptions & CssMinimizerPlugin.DefinedDefaultMinimizerAndOptions<CssMinimizerPlugin.CssNanoOptionsExtended>;
type PluginCssMinimizerOptions = {
    /**
     * Used to customize the options of css-minimizer-webpack-plugin.
     * @see https://github.com/webpack-contrib/css-minimizer-webpack-plugin
     */
    pluginOptions?: ConfigChain<CssMinimizerPluginOptions>;
};
declare function applyCSSMinimizer(chain: RspackChain, CHAIN_ID: ChainIdentifier, options?: PluginCssMinimizerOptions): void;
declare const PLUGIN_CSS_MINIMIZER_NAME = "rsbuild:css-minimizer";
declare const pluginCssMinimizer: (options?: PluginCssMinimizerOptions) => RsbuildPlugin;

export { type CssMinimizerPluginOptions, PLUGIN_CSS_MINIMIZER_NAME, type PluginCssMinimizerOptions, applyCSSMinimizer, pluginCssMinimizer };
