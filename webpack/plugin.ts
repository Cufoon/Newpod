import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackBar from 'webpackbar';
import webpack from 'webpack';

import env from './env';
import appSetting from '../config';

import type { PluginsType } from './types';

const makePlugins = (): PluginsType => {
  console.log('plugins', 'isDev', env.isDev());
  const result = [
    new WebpackBar(),
    new CopyPlugin({
      patterns: [
        {
          from: env.PUBLIC_DIR(),
          to: env.BUILD_DIR(),
          context: env.PUBLIC_DIR(),
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/template.hbs', '**/template-dev.hbs']
          },
          noErrorOnMissing: true
        }
      ]
    }),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: '[name].html',
      template: env.PUBLIC_DIR('template.hbs'),
      publicPath: appSetting.subPath,
      inject: 'body'
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
  ];
};

export default makePlugins;
