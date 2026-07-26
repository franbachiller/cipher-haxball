// Copy this file to config.js and fill in your Supabase credentials.
// config.js is gitignored — it holds the service_role keys (full DB access).
// NEVER commit config.js.
//
// Two environments: dev is the default. Open index.html?env=prod to target
// production (the panel shows a loud red PRODUCTION badge when you do).
(function () {
  const environments = {
    dev: {
      SUPABASE_URL: 'https://YOUR-DEV-PROJECT.supabase.co',
      SUPABASE_SERVICE_KEY: 'your-dev-service_role-key-here',
    },
    prod: {
      SUPABASE_URL: 'https://YOUR-PROD-PROJECT.supabase.co',
      SUPABASE_SERVICE_KEY: 'your-prod-service_role-key-here',
    },
  };

  const env = new URLSearchParams(location.search).get('env') === 'prod' ? 'prod' : 'dev';
  window.CIPHER_ADMIN_CONFIG = { env, ...environments[env] };
})();
