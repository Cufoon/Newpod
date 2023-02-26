const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const { GenerateSW } = require('workbox-webpack-plugin');
const webpack = require('webpack');
const env = require('./env');

//Argument type {patterns: [{noErrorOnMissing: boolean, context: (any), globOptions: {gitignore: boolean, dot: boolean, ignore: string[]}, from: (any), to: (any)}]} is not assignable to parameter type PluginOptions | undefined  Type [{noErrorOnMissing: boolean, context: (any), globOptions: {gitignore: boolean, dot: boolean, ignore: string[]}, from: (any), to: (any)}] is not assignable to type Pattern[]    Type {noErrorOnMissing: boolean, context: (any), globOptions: {gitignore: boolean, dot: boolean, ignore: string[]}, from: (any), to: (any)}[] is not assignable to type Pattern[]      Object literal may only specify known properties, but the following are extra: 'dot', 'ignore'
module.exports = () => {
  console.log('plugin.js', 'isDev', env.isDev());
  const result = [
    new CopyPlugin({
      patterns: [
        {
          from: env.PUBLIC_DIR(),
          to: env.BUILD_DIR(),
          context: env.PUBLIC_DIR(),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/template.html', '**/template-dev.html']
          },
          noErrorOnMissing: true
        }
      ]
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: '[name].html',
      template: env.PUBLIC_DIR('template.html')
    })
  ];
  if (env.isDev()) {
    return result;
  }
  return [
    ...result,
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: env.PROJECT_DIR('tsconfig.json')
      }
    }),
    new TerserPlugin({
      terserOptions: {
        format: {
          comments: false
        }
      },
      extractComments: false
    }),
    new webpack.BannerPlugin({
      banner: 'Copyright (c) Cufoon'
    })
    // new GenerateSW({
    //   swDest: env.BUILD_DIR('sw.js'),
    //   cleanupOutdatedCaches: true,
    //   mode: 'production',
    //   navigateFallback: '/index.html'
    // })
  ];
};
