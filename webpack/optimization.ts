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
    minimizer: [new CssMinimizerPlugin(), new HtmlMinimizerPlugin(), '...'],
    moduleIds: 'deterministic',
    nodeEnv: 'production',
    realContentHash: true,
    removeEmptyChunks: true,
    runtimeChunk: {
      name: 'runtime'
    },
    providedExports: true,
    sideEffects: true,
    usedExports: true,
    concatenateModules: true,
    flagIncludedChunks: true,
    innerGraph: true,
    mangleExports: true,
    mergeDuplicateChunks: true,
    removeAvailableModules: true,
    splitChunks: {
      automaticNameDelimiter: '.',
      chunks: 'all',
      hidePathInfo: true,
      minSize: 1000,
      maxSize: 100000,
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
