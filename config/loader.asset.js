const json5 = require('json5');
const toml = require('toml');
const yaml = require('yamljs');
const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = () => [
  {
    test: /\.(png|jpg|jpeg|gif|webp)$/i,
    type: 'asset/resource'
  },
  {
    test: /\.svg$/i,
    resourceQuery: /raw/,
    type: 'asset/resource'
  },
  {
    test: /\.svg$/i,
    type: 'asset/inline',
    resourceQuery: { not: [/raw/] },
    generator: {
      dataUrl: (content) => {
        content = content.toString();
        return svgToMiniDataURI(content);
      }
    }
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource'
  },
  {
    test: /\.toml$/i,
    type: 'json',
    parser: {
      parse: toml.parse
    }
  },
  {
    test: /\.ya?ml$/i,
    type: 'json',
    parser: {
      parse: yaml.parse
    }
  },
  {
    test: /\.json5$/i,
    type: 'json',
    parser: {
      parse: json5.parse
    }
  }
];
