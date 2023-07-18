const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

exports.sw = new SWPrecacheWebpackPlugin({
  // By default, a cache-busting query parameter is appended to requests
  // used to populate the caches, to ensure the responses are fresh.
  // If a URL is already hashed by Webpack, then there is no concern
  // about it being stale, and the cache-busting can be skipped.
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  filename: 'service-worker.js',
  logger(message) {
    if (message.indexOf('Total precache size is') === 0) {
      // This message occurs for every build and is a bit too noisy.
      return;
    }
    console.log(message);
  },
  minify: true, // minify and uglify the script
  navigateFallback: '/index.html',
  staticFileGlobsIgnorePatterns: [/\.map$/, /assets\.json$/],
});
/* The basic is very easy, just define the file name and
 * it's gonna be created in the public folder along with the assets
 */
exports.manifest = new ManifestPlugin({
  fileName: 'assets.json', // Not to confuse with manifest.json
});
// Export copy-webpack-plugin instance
exports.copy = new CopyWebpackPlugin([
  { from: 'resources/assets/manifest' }, // define the path of the files to be copied
  { from: 'resources/assets/robots.txt' },
  { from: 'resources/assets/oneSignal/OneSignalSDKUpdaterWorker.js' },
  { from: 'resources/assets/oneSignal/OneSignalSDKWorker.js' },
]);
