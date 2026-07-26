// Copy this file to config.js and fill in your Supabase credentials.
// config.js is gitignored. The anon key is safe to embed in the shipped
// app (it can only call the RPC functions), but we keep it out of the repo.
//
// Two environments: dev is the default. Set CIPHER_ENV=prod to target prod.
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

const env = process.env.CIPHER_ENV === 'prod' ? 'prod' : 'dev';
console.log(`[Cipher] Environment: ${env}`);

module.exports = { env, ...environments[env] };
