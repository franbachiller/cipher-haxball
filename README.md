# Cipher

HaxBall enhancement suite: an Electron launcher that injects gameplay assists
into haxball.com, gated behind a Supabase-backed license system.

## Structure

```
electron/    Electron launcher (main process, interceptor, license check, login UI)
admin/       Static admin panel for managing license keys (local-only)
supabase/    Database schema (run once in the Supabase SQL editor)
src/         Original Playwright bot + the injected bridge (src/inject/bridge.js)
docs/        Reverse-engineering notes
dump/        Captured game assets for reference
```

## Setup after cloning

Credentials are **not** committed. You must create two config files from the
provided templates:

### 1. Launcher config

```bash
cp electron/config.example.js electron/config.js
```

Fill in your Supabase URL and **anon** key (Settings → API in the dashboard).

### 2. Admin panel config

```bash
cp admin/config.example.js admin/config.js
```

Fill in your Supabase URL and **service_role** key. This key has full DB
access — keep `admin/config.js` local, never commit it (it is gitignored).

### 3. Database

Run `supabase/schema.sql` in the Supabase SQL editor. It also requires the
`pgcrypto` extension for token generation (the schema enables it).

## Running

```bash
cd electron
npm install
npm start
```

## Admin panel

Open `admin/index.html` in a browser. It talks directly to Supabase to create,
revoke, and delete license keys.

## Security notes

- `config.js` files (both) are gitignored — they hold the real keys.
- The anon key is safe to ship in the launcher (it can only call the license
  RPC functions). The service_role key must stay on your machine only.
- Never deploy the admin panel publicly.
