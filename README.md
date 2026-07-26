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

## Environments

There are two Supabase projects: **dev** and **prod**. Both run the same
schema; only the credentials differ. **Dev is always the default** so routine
testing never touches the production license database.

- Launcher: defaults to dev. Set `CIPHER_ENV=prod` to target prod.
- Admin panel: defaults to dev. Open `index.html?env=prod` to target prod.
  The panel shows a loud red `PRODUCTION` badge (and a red top border) whenever
  you are pointed at prod, so you can never edit it by accident.

## Setup after cloning

Credentials are **not** committed. Create both config files from the templates:

```bash
cp electron/config.example.js electron/config.js
cp admin/config.example.js admin/config.js
```

Each config holds a `dev` and a `prod` block. Fill both in:

- **Launcher** (`electron/config.js`): the **anon** key for each project
  (Settings → API in the dashboard).
- **Admin** (`admin/config.js`): the **service_role** key for each project.
  This key has full DB access — the file is gitignored, keep it local.

### Database

Run `supabase/schema.sql` in the SQL editor of **each** project (dev and prod).
The schema uses `extensions.gen_random_bytes` for token generation, available
by default on Supabase.

## Development workflow

Day-to-day feature work (editing `src/inject/bridge.js`, tweaking the launcher)
happens on the `dev` branch against the dev Supabase project:

```bash
git checkout dev
cd electron && npm install && npm start   # defaults to dev
```

Iterate on the bridge and test in a real game with F8/F9. Nothing you do
reaches a real user.

When something is stable, merge to `main` and tag the release:

```bash
git checkout main && git merge dev
git tag v1.0.0
```

Only a tagged build, run with `CIPHER_ENV=prod` and the obfuscated bridge,
should ever be distributed.

## Admin panel

Open `admin/index.html` in a browser (dev by default). It talks directly to
Supabase to create, revoke, and delete license keys. To manage production
keys, open `admin/index.html?env=prod`.

## Security notes

- `config.js` files (both) are gitignored — they hold the real keys.
- The anon key is safe to ship in the launcher (it can only call the license
  RPC functions). The service_role key must stay on your machine only.
- Never deploy the admin panel publicly.
