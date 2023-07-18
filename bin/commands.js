const shell = require('shelljs');
const config = require('config');
const colors = require('colors');

const option = process.argv[2];

// The following will allow you to add your own
// - pre process
// - post process
// - parallel process
// - logging
//
// You can add your process here and have package.json to proxy your command
// Please look at package.json -> "scripts" section
switch (option) {
  case 'lint':
    shell.exec('cross-env eslint --fix resources/js/** --format node_modules/eslint-friendly-formatter . --ext .js --ext .jsx  --cache; exit 0');
    break;
  case 'dev':
    shell.exec(`cross-env webpack-dev-server --config webpack.config.dev-server.babel.js --hot --progress --no-info --inline --colors`);
    break;
  case 'build':
    shell.exec(`cross-env rimraf docroot && webpack --config webpack.config.build.babel.js --progress --display-error-details`);
    shell.exec(`rimraf public/assets`);
    shell.exec(`rimraf resources/views/app.blade.php`);
    shell.exec(`rimraf public/assets.json`);
    shell.exec(`rimraf public/manifest.json`);
    shell.exec(`rimraf public/service-worker.js`);
    shell.exec(`rimraf public/OneSignalSDKUpdaterWorker.js`);
    shell.exec(`rimraf public/OneSignalSDKWorker.js`);
    shell.exec(`rimraf public/*.png`);
    shell.exec(`cp -R docroot/assets public/assets`);
    shell.exec(`cp docroot/app.blade.php resources/views/app.blade.php`);
    shell.exec(`cp docroot/assets.json public/assets.json`);
    shell.exec(`cp docroot/manifest.json public/manifest.json`);
    shell.exec(`cp docroot/service-worker.js public/service-worker.js`);
    shell.exec(`cp docroot/OneSignalSDKUpdaterWorker.js public/OneSignalSDKUpdaterWorker.js`);
    shell.exec(`cp docroot/OneSignalSDKWorker.js public/OneSignalSDKWorker.js`);
    shell.exec(`cp docroot/*.png public/`);
    break;
  default:
    // If the app type is invalid, stop execution of the file.
    console.log(colors.green('Invalid option.'));
    console.log(colors.green('See README.md for more details.'));
    return;
}
