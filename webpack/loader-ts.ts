import type { LoadersType } from './types';


const makeTsLoader = (): LoadersType => [
  {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-transform-runtime',
            [
              'babel-plugin-import',
              {
                libraryName: '@arco-design/web-react',
                libraryDirectory: 'es',
                camel2DashComponentName: false,
                style: 'css' // 样式按需加载
              }
            ]
          ]
        }
      }
    ]
  }
];

export default makeTsLoader;
