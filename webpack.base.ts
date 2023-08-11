import webpack from 'webpack';
import tsLoader from './webpack/loader-ts';
import scssLoader from './webpack/loader-scss';
import assetLoader from './webpack/loader-asset';
import env from './webpack/env';
import plugin from './webpack/plugin';
import pathAlias from './webpack/alias';
import optimization from './webpack/optimization';
import fallback from './webpack/fallback';
import appSetting from './.apprc';

interface ConfigBaseParams {
  isDev: boolean;
}

type ConfigBaseFunc = (p: ConfigBaseParams) => webpack.Configuration;

const configBase: ConfigBaseFunc = ({ isDev }) => {
  if (isDev) {
    env.setMode(env.MODE.DEV);
  }
  return {
    mode: isDev ? env.MODE.DEV : env.MODE.PROD,
    entry: { index: env.SOURCE_DIR('root.tsx') },
    output: {
      clean: true,
      chunkLoadingGlobal: 'CufoonChunkLoader',
      iife: true,
      hashDigestLength: 24,
      hashFunction: 'sha512',
      hashSalt: 'cufoon-hash',
      filename: '[name].[contenthash].js',
      chunkFilename: 'chunk.[name].[contenthash].js',
      path: env.BUILD_DIR(),
      publicPath: '/'
    },
    module: {
      rules: [...tsLoader(), ...scssLoader(), ...assetLoader()]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
      alias: { ...pathAlias() },
      fallback: fallback()
    },
    optimization: { ...optimization() },
    plugins: [...plugin()],
    devServer: {
      client: {
        overlay: {
          errors: true,
          warnings: false
        },
        progress: true
      },
      headers: [
        {
          key: 'CUFOON-DEVELOP',
          value: 'cufoon.com'
        }
      ],
      host: '0.0.0.0',
      hot: true,
      liveReload: true,
      port: 2233,
      proxy: {
        [`${appSetting.subPath}/api`]: {
          target: 'https://dnspod.tencentcloudapi.com/',
          secure: false,
          changeOrigin: true,
          pathRewrite: { [`^${appSetting.subPath}/api`]: '' },
          headers: {
            host: 'dnspod.tencentcloudapi.com',
            'content-type': 'application/json; charset=utf-8'
          }
        }
      },
      historyApiFallback: {
        index: '/index.html'
      },
      static: env.BUILD_DIR()
    },
    devtool: isDev ? 'eval-source-map' : false
  };
};

export default configBase;
