# Cipher

HaxBall enhancement suite: an Electron launcher that injects gameplay assists
into haxball.com, gated behind a Supabase-backed license system.

Para el procedimiento operativo completo de desarrollo, pruebas, seguridad y
releases, ver [`docs/WORKFLOW.md`](docs/WORKFLOW.md).

## Current release

La versión oficial es **v1.1.0** (2026-09-02), commit `ffe8ab4`.

- Instalador local: `electron/dist/Cipher Setup 1.1.0.exe`
- SHA-256: `675F03BD3482F33E13B1054F1257C1AB50E4EE696F02A396E87D19D070EBE857`
- Actualización manual: todavía no existe auto-updater.
- Sin firma digital: Windows puede mostrar SmartScreen.

El binario de `dist/` no se commitea. Ver el detalle funcional, validaciones y
limitaciones en [`CHANGELOG.md`](CHANGELOG.md).

## Gameplay controls

- `Insert`: mostrar u ocultar el panel in-game.
- `F8`: Aim Assist. La trayectoria usa las colisiones reales del estadio.
- `F9`: AI Bot.
- `Ctrl`: OP Mode.

El panel y los atajos modifican el mismo estado; sus indicadores permanecen
sincronizados.

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
schema; only the credentials differ.

The launcher's environment is tied to `app.isPackaged`, not to anything the
client controls:

- Running from source (`npm start`) → **dev**
- The distributed `.exe` / installer → **prod**

A client's app is always packaged, so they can **never** reach dev; and you
can't accidentally hit prod from source. The prod build ships only
`config.prod.js` — the packaged binary contains **zero** dev credentials
(verified by extracting the asar).

The admin panel defaults to dev; open `index.html?env=prod` to target prod. It
shows a loud red `PRODUCTION` badge (and red top border) so you never edit prod
by accident.

## Setup after cloning

Credentials are **not** committed. Create the local credential files from the
templates:

```bash
# Launcher — dev credentials (anon key), used by npm start
cp electron/config.dev.example.js electron/config.dev.js

# Admin panel — dev + prod service_role keys
cp admin/config.example.js admin/config.js
```

- `electron/config.dev.js` — dev anon key. (`config.prod.js` is NOT created by
  hand; the build generates it, see below.)
- `admin/config.js` — holds a `dev` and `prod` block with service_role keys.
  Full DB access; gitignored, keep it local.

### Database

Run `supabase/schema.sql` in the SQL editor of **each** project (dev and prod).
The schema uses `extensions.gen_random_bytes` for token generation, available
by default on Supabase.

## Development workflow

Day-to-day feature work (editing `src/inject/bridge.js`, tweaking the launcher)
happens on the `dev` branch against the dev Supabase project:

```bash
git checkout dev
cd electron && npm install && npm start   # runs against dev (unpackaged)
```

Iterate on the bridge and test in a real game: movimiento manual, panel con
`Insert`, Aim Assist con `F8`, AI Bot con `F9` y OP Mode con `Ctrl`. Nothing you
do reaches a real user.

When something is stable, merge to `main` and tag the release:

```bash
git checkout main && git merge dev
VERSION=1.1.0 # reemplazar por la versión del release
git tag "v$VERSION"
```

## Building the installer

The prod build injects prod credentials from environment variables, obfuscates
the bridge, packages the `.exe`, and deletes the generated `config.prod.js`
afterwards. The dev credentials are never included.

```powershell
cd electron
$env:CIPHER_PROD_SUPABASE_URL="https://YOUR-PROD-PROJECT.supabase.co"
$env:CIPHER_PROD_SUPABASE_ANON_KEY="your-prod-anon-key"
npm run build
```

The installer lands in `electron/dist/`. To verify no dev credentials leaked,
extract the asar and grep for the dev project ref:

```powershell
npx asar extract dist/win-unpacked/resources/app.asar out
# grep the dev project ref in `out/` — it should return nothing
```

## Admin panel

Open `admin/index.html` in a browser (dev by default). It talks directly to
Supabase to create, revoke, and delete license keys. Use the visible
`DEV / PRODUCTION` switch in the header to change environments. Production is
always marked red, changes the generate button text, and asks for confirmation
before creating a key.

## Security notes

- All real keys live in gitignored files: `electron/config.dev.js`,
  `electron/config.prod.js` (build-generated), and `admin/config.js`.
  `electron/config.js` is a committed loader that holds no credentials.
- The anon key is safe to ship in the launcher (it can only call the license
  RPC functions; RLS blocks direct table access). The service_role key must
  stay on your machine only.
- Never deploy the admin panel publicly.
