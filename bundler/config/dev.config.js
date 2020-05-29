/* eslint "import/no-extraneous-dependencies": 1 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const getCommitHash = require('../utils/get_commit_hash');
const getClientEnvironment = require('../utils/env');

const env = getClientEnvironment();
const publicPath = '/';

module.exports = {
  mode: 'development',
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  devtool: 'cheap-module-source-map',
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/${env.raw.ENTRY_FILE}`),
  ],
  output: {
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    path: path.resolve(__dirname, `../../${env.raw.OUTPUT_FOLDER}`),
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'assets/js/[name].[hash].js',
    // There are also additional JS chunk files if you use code splitting.
    chunkFilename: 'assets/js/[name].[hash].chunk.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath,
    globalObject: 'this',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  externals: {
    ws: 'WebSocket',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 30000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  module: {
    strictExportPresence: true,
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          // This loader parallelizes code compilation, it is optional but
          // improves compile time on larger projects
          'thread-loader',
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.yaml$/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.(woff2?|ttf|otf|eot|png|jp?g)$/,
        use: ['url-loader'],
      },
    ],
  },
  plugins: [
    // Copies individual files or entire directories to the build directory.
    // https://www.npmjs.com/package/copy-webpack-plugin
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/assets`),
      },
    ]),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'development') { ... }..
    new webpack.DefinePlugin({
      'process.env': env.stringified,
    }),
    // This plugin will cause hashes to be based on the relative path of
    // the module, generating a four character string as the module id.
    // Suggested for use in production.
    // https://webpack.js.org/plugins/hashed-module-ids-plugin/
    new webpack.HashedModuleIdsPlugin(),
    // Generates an `index.html` file with the <script> injected.
    // https://www.npmjs.com/package/html-webpack-plugin
    new HtmlWebpackPlugin({
      // Now you can use env variables in html.
      // For example `<%= htmlWebpackPlugin.options.PORT %>`.
      ...env.raw,
      // Disable service-worker for development mode
      USE_SERVICE_WORKER: '',
      template: path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/${env.raw.ENTRY_HTML_FILE}`),
      publicPath,
    }),
    // Enhances html-webpack-plugin functionality with different deployment
    // options for your scripts including
    // https://www.npmjs.com/package/script-ext-html-webpack-plugin
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
    // This is necessary to emit hot updates (currently CSS only):
    new webpack.HotModuleReplacementPlugin(),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Generate json with unique string (commit/uuid)
    // https://www.npmjs.com/package/generate-json-webpack-plugin
    new GenerateJsonPlugin('build_info.json', {
      buildInfo: getCommitHash(),
    }),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  // Turn off performance processing because we utilize
  // our own hints via the FileSizeReporter
  performance: false,
};
