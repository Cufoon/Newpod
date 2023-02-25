const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const env = require('./env');

module.exports = () => {
  console.log('optimization.js', 'isDev', env.isDev());
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
      minSize: 17408,
      maxSize: 535552,
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
