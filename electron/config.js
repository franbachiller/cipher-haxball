// Environment loader — committed, contains NO credentials.
//
// Credentials live in separate gitignored files that are loaded on demand:
//   - config.dev.js   dev creds, used when running from source (npm start)
//   - config.prod.js  prod creds, GENERATED at build time from env vars
//                     (see scripts/build.js) and packaged into the .exe
//
// Environment is tied to app.isPackaged, not to an env var the client could
// change:
//   - running from source (npm start)  -> dev   (isPackaged === false)
//   - the distributed .exe / installer -> prod  (isPackaged === true)
//
// Because the prod build only ships config.prod.js (config.dev.js is excluded
// by electron-builder), the distributed binary contains ZERO dev credentials.
// CIPHER_ENV=dev|prod can force an env for edge cases (e.g. testing a build).
const { app } = require('electron');

let env;
if (process.env.CIPHER_ENV === 'prod' || process.env.CIPHER_ENV === 'dev') {
  env = process.env.CIPHER_ENV;
} else {
  env = app.isPackaged ? 'prod' : 'dev';
}

let creds;
try {
  // Lazy require: only the file for the active env is ever loaded, so the
  // prod build never touches config.dev.js (which isn't shipped anyway).
  creds = env === 'prod' ? require('./config.prod.js') : require('./config.dev.js');
} catch (err) {
  throw new Error(
    `[Cipher] Missing config.${env}.js. ` +
    (env === 'dev'
      ? 'Copy config.dev.example.js to config.dev.js and fill in your dev credentials.'
      : 'Run the build via scripts/build.js so prod credentials are injected.')
  );
}

console.log(`[Cipher] Environment: ${env} (packaged: ${app.isPackaged})`);

module.exports = { env, ...creds };
