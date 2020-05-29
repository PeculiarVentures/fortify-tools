/* eslint "import/no-extraneous-dependencies": 1 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const getCommitHash = require('../utils/get_commit_hash');
const getClientEnvironment = require('../utils/env');

const env = getClientEnvironment();
const plugins = [];
let publicPath = env.raw.PUBLIC_PATH || '/';

if (publicPath.slice(-1) !== '/') {
  publicPath = `${publicPath}/`;
}

if (env.raw.ANALYZE_BUNDLE === 'true') {
  // Visualize size of webpack output files with an interactive zoomable treemap.
  // https://www.npmjs.com/package/webpack-bundle-analyzer
  plugins.push(new BundleAnalyzerPlugin());
}

if (env.raw.USE_SERVICE_WORKER === 'true') {
  // Generate a service worker script that will precache, and keep up to date,
  // the HTML & assets that are part of the Webpack build.
  // https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
  plugins.push(new WorkboxWebpackPlugin.GenerateSW({
    swDest: 'sw.js',
    cacheId: 'app',
    clientsClaim: true,
    skipWaiting: true,
    exclude: [
      /\.map$/,
      /asset-manifest\.json$/,
      /info\.json$/,
    ],
    importWorkboxFrom: 'cdn',
    navigateFallback: `${publicPath}index.html`,
    navigateFallbackBlacklist: [
      // Exclude URLs starting with /_, as they're likely an API call
      new RegExp('^/_'),
      // Exclude URLs containing a dot, as they're likely a resource in
      // public/ and not a SPA route
      new RegExp('/[^/]+\\.[^/]+$'),
    ],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
        handler: 'cacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: {
            maxEntries: 5,
            maxAgeSeconds: 600,
          },
        },
      },
    ],
  }));
}

module.exports = {
  mode: 'production',
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: env.raw.USE_SOURCE_MAP === 'true' ? 'source-map' : false,
  entry: path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/${env.raw.ENTRY_FILE}`),
  output: {
    // The build folder.
    path: path.resolve(__dirname, `../../${env.raw.OUTPUT_FOLDER}`),
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
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
    minimize: true,
    minimizer: [
      // This plugin for minify your JavaScript.
      // https://github.com/webpack-contrib/terser-webpack-plugin
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: false,
      }),
    ],
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
    // if (process.env.NODE_ENV === 'production') { ... }.
    // It is absolutely essential that NODE_ENV was set to production here.
    // Otherwise React will be compiled in the very slow development mode.
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
      template: path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/${env.raw.ENTRY_HTML_FILE}`),
      publicPath,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new HtmlWebpackPlugin({
      // Now you can use env variables in html.
      // For example `<%= htmlWebpackPlugin.options.PORT %>`.
      ...env.raw,
      template: path.resolve(__dirname, `../../${env.raw.ENTRY_FOLDER}/${env.raw.ENTRY_HTML_FILE}`),
      publicPath,
      filename: '404.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // Enhances html-webpack-plugin functionality with different deployment
    // options for your scripts including
    // https://www.npmjs.com/package/script-ext-html-webpack-plugin
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer',
    }),
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
    ...plugins,
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
