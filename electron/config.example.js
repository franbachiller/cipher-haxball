// Copy this file to config.js and fill in your Supabase credentials.
// config.js is gitignored. The anon key is safe to embed in the shipped
// app (it can only call the RPC functions), but we keep it out of the repo.
//
// Environment is tied to whether the app is packaged:
//   - Running from source (npm start)  -> dev
//   - The distributed .exe / installer -> prod
// A client's app is always packaged, so they can never reach dev.
// CIPHER_ENV=dev|prod forces an env for edge cases.
const { app } = require('electron');

const environments = {
  dev: {
    SUPABASE_URL: 'https://YOUR-DEV-PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'your-dev-anon-key-here',
  },
  prod: {
    SUPABASE_URL: 'https://YOUR-PROD-PROJECT.supabase.co',
    SUPABASE_ANON_KEY: 'your-prod-anon-key-here',
  },
};

let env;
if (process.env.CIPHER_ENV === 'prod' || process.env.CIPHER_ENV === 'dev') {
  env = process.env.CIPHER_ENV;
} else {
  env = app.isPackaged ? 'prod' : 'dev';
}

console.log(`[Cipher] Environment: ${env} (packaged: ${app.isPackaged})`);

module.exports = { env, ...environments[env] };
