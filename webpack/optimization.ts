import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import HtmlMinimizerPlugin from 'html-minimizer-webpack-plugin';

import env from './env';

import type { OptimizationType } from './types';

const makeOptimizationConfigure = (): OptimizationType => {
  console.log('optimization', 'isDev', env.isDev());
  if (env.isDev()) {
    return {};
  }
  return {
    emitOnErrors: true,
    minimize: true,
    minimizer: ['...', new CssMinimizerPlugin(), new HtmlMinimizerPlugin()],
    moduleIds: 'deterministic',
    nodeEnv: 'production',
    providedExports: true,
    realContentHash: true,
    removeEmptyChunks: true,
    runtimeChunk: 'single',
    sideEffects: true,
    usedExports: true,
    splitChunks: {
      automaticNameDelimiter: '.',
      chunks: 'all',
      hidePathInfo: true,
      minSize: 520000,
      maxSize: 920000,
      minRemainingSize: 0,
      minChunks: 1,
      cacheGroups: {
        lib: {
          name: 'lib',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        other: {
          name: 'other',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  };
};

export default makeOptimizationConfigure;
