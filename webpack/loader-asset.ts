import json5 from 'json5';
import toml from 'toml';
import yaml from 'yamljs';
import svgToMiniDataURI from 'mini-svg-data-uri';

import type { LoadersType } from './types';

const makeAssetLoader = (): LoadersType => [
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
      dataUrl: (content: string) => {
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
  },
  {
    test: /\.apprc$/i,
    type: 'json',
    parser: {
      parse: json5.parse
    }
  },
  { test: /\.handlebars$/, loader: 'handlebars-loader' },
  { test: /\.hbs$/, loader: 'handlebars-loader' }
];

export default makeAssetLoader;
