const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = require('./env');

const cssModuleLoader = () => ({
  loader: 'css-loader',
  options: {
    modules: {
      mode: 'local',
      exportGlobals: true,
      localIdentName: env.isDev() ? '[path][name]__[local]' : '[hash:base64:12]',
      localIdentContext: env.SOURCE_DIR(),
      localIdentHashFunction: 'sha512',
      localIdentHashSalt: 'cufoon-hash',
      exportLocalsConvention: 'camelCaseOnly',
      exportOnlyLocals: false
    }
  }
});

module.exports = () => [
  {
    test: /\.css$/i,
    resourceQuery: { not: [/inline/] },
    use: [MiniCssExtractPlugin.loader, 'css-loader']
  },
  {
    test: /\.css$/i,
    resourceQuery: /inline/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.s[ac]ss$/i,
    resourceQuery: { and: [/raw/], not: [/inline/] },
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.s[ac]ss$/i,
    resourceQuery: { and: [/inline/], not: [/raw/] },
    use: [
      'style-loader',
      'css-loader',
      'resolve-url-loader',
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  },
  {
    test: /\.s[ac]ss$/i,
    resourceQuery: { not: [/raw/, /inline/] },
    use: [
      MiniCssExtractPlugin.loader,
      // 将 css 转化成 commonjs 模块
      cssModuleLoader(),
      // 解决 scss 中相对路径问题，此 loader 依赖于 sourcemap
      'resolve-url-loader',
      // 将 scss 编译成 css
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true
        }
      }
    ]
  }
];
