// Requiring dependencies
// ================================================================================
import path from 'path';
import webpack from 'webpack';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import config from 'config';

// Environment variable injection
// ================================================================================
import packageJSON from './package.json'

// Please read the following link if
// you have no idea how to use this feature
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true });

// trace which loader is deprecated
// feel free to remove that if you don't need this feature
process.traceDeprecation = false;

process.env.PACKAGE_VERSION = packageJSON.version

// Defining config variables
// ================================================================================

export const BUILD_PATH = path.join(__dirname, `docroot${config.get('publicPath')}`)

const COMMON_LOADERS = [
  {
    test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg|md)$/i,
    use: [
      {
        loader: 'file-loader',
        options: {
          hash: 'sha512',
          digest: 'hex',
          name: `${config.get('assetPath')}/[hash].[ext]`,
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          query: {
            mozjpeg: {
              progressive: true,
            },
            gifsicle: {
              interlaced: true,
            },
            optipng: {
              optimizationLevel: 7,
            },
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
          },
        },
      },
    ],
  }, {
    test: /\.(js|jsx)?$/,
    exclude: /node_modules/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      plugins: [
        'transform-runtime',
        'transform-decorators-legacy',
        'syntax-dynamic-import',
      ],
    },
  },
  {
    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: `${config.get('assetPath')}/[name].[ext]`,
        },
      },
    ],
  },
  {
    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
          name: `${config.get('assetPath')}/[name].[ext]`,
        },
      },
    ],
  },
  {
    test: /\.[ot]tf(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
          name: `${config.get('assetPath')}/[name].[ext]`,
        },
      },
    ],
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/vnd.ms-fontobject',
          name: `${config.get('assetPath')}/[name].[ext]`,
        },
      },
    ],
  },
  {
    test: /\.(html)$/,
    use: {
      loader: 'html-loader',
      options: {
        attributes: true
      }
    }
  }
];

// Export
// ===============================================================================
export const JS_SOURCE = config.get('jsSourcePath');

export default {
  output: {
    path: path.join(__dirname, 'docroot'),
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss'],
    modules: [
      path.join(__dirname, 'resources'),
      path.join(__dirname, 'assets'),
      path.join(__dirname, JS_SOURCE),
      'node_modules',
    ],
    alias: {
      '~layout': path.resolve(__dirname, 'resources/js/common/components/Layout'),
      '~components': path.resolve(__dirname, 'resources/js/common/components'),
      '~api': path.resolve(__dirname, 'resources/js/common/api'),
      '~views': path.resolve(__dirname, 'resources/js/views'),
      '~theme': path.resolve(__dirname, 'resources/style/'),
      '~assets': path.resolve(__dirname, 'resources/assets/'),
      '~redux': path.resolve(__dirname, 'resources/js/redux/'),
      '~common': path.resolve(__dirname, 'resources/js/common'),
    },
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/), // https://github.com/webpack/webpack/issues/353
    new CaseSensitivePathsPlugin(),
  ],
  module: {
    rules: COMMON_LOADERS,
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  externals: {
    console: true,
    fs: '{}',
    tls: '{}',
    net: '{}',
  },
};
