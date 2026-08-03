# Cipher — Flujo de trabajo

Este documento define cómo desarrollar, probar y publicar Cipher sin mezclar
DEV con PRODUCTION ni filtrar secretos.

## Regla principal

- El trabajo diario se hace en la rama `dev`.
- `npm start` ejecuta una app no empaquetada y apunta automáticamente a
  Supabase DEV.
- Los clientes reciben únicamente un instalador empaquetado, que apunta
  automáticamente a Supabase PRODUCTION.
- Nunca se prueba una feature nueva directamente con usuarios reales.

## Entornos

| Contexto | Entorno | Supabase |
| --- | --- | --- |
| `npm start` desde el código | DEV | Proyecto de desarrollo |
| Admin abierto normalmente | DEV | Proyecto de desarrollo |
| Admin con selector PRODUCTION | PROD | Proyecto de producción |
| `.exe` o instalador empaquetado | PROD | Proyecto de producción |

La selección del launcher depende de `app.isPackaged`:

- `false` → DEV
- `true` → PRODUCTION

Los usuarios del instalador no pueden entrar al entorno DEV.

## Desarrollo diario

```powershell
git checkout dev
git pull origin dev
cd electron
npm install
npm start
```

Para modificar las features del juego:

1. Editar `src/inject/bridge.js`.
2. Cerrar y volver a abrir el launcher.
3. Activar una licencia creada en DEV.
4. Entrar a una partida de prueba.
5. Verificar F8, F9 y cualquier feature modificada.
6. Revisar la consola:

```text
[Cipher] Environment: dev
[Cipher] CDP Fetch interception enabled (game-min.js only)
[Cipher] Bridge injected into game-min.js (...)
```

## Licencias y panel de administración

Abrir:

```text
admin/index.html
```

El panel abre en DEV por defecto. El selector superior indica y cambia el
entorno:

- `DEV`: licencias para pruebas desde `npm start`.
- `PRODUCTION`: licencias para el instalador distribuido.

Antes de generar una licencia, comprobar:

1. Qué botón del selector está activo.
2. Qué texto muestra el botón de generación.
3. Que PRODUCTION aparezca en rojo si se desea una licencia real.

Una licencia creada en DEV no funciona en el instalador. Una licencia creada en
PRODUCTION no debe usarse para pruebas de desarrollo.

### Estados

- `unused`: creada, todavía sin HWID.
- `active`: activada y vinculada a una máquina.
- `revoked`: bloqueada; el launcher la rechazará en el siguiente inicio.
- `expired`: venció la fecha configurada.

`Delete` elimina la licencia y sus logs relacionados permanentemente.

## Secretos

Archivos locales que nunca deben commitearse:

```text
electron/config.dev.js
electron/config.prod.js
admin/config.js
.env*
```

Archivos seguros para commitear:

```text
electron/config.js
electron/config.dev.example.js
electron/config.prod.example.js
admin/config.example.js
```

Antes de cada commit sensible:

```powershell
git status --short
git grep --cached -l "SUPABASE_SERVICE_KEY"
git grep --cached -l "<PROJECT_REF_DEV>"
git grep --cached -l "<PROJECT_REF_PROD>"
```

Las tres búsquedas deben devolver vacío fuera de los templates/documentación
esperados.

La `service_role` de Supabase solo puede existir en `admin/config.js`. Nunca
debe entrar al launcher, al instalador ni al repositorio.

## Build de producción

El build:

1. Genera temporalmente `electron/config.prod.js`.
2. Incluye únicamente la URL y anon key de PRODUCTION.
3. Excluye `config.dev.js`.
4. Obfusca `src/inject/bridge.js` como `bridge.enc.js`.
5. Construye el instalador.
6. Elimina `config.prod.js`, incluso si el build falla.

Ejecutar:

```powershell
cd electron
$env:CIPHER_PROD_SUPABASE_URL="https://PROD.supabase.co"
$env:CIPHER_PROD_SUPABASE_ANON_KEY="ANON_KEY_PROD"
npm run build
```

Salida:

```text
electron/dist/Cipher Setup <version>.exe
```

Nunca construir producción con credenciales DEV.

## Auditoría del build

Extraer el paquete:

```powershell
cd electron
npx asar extract dist/win-unpacked/resources/app.asar out
```

Comprobar:

- Existe `out/config.prod.js`.
- No existe `out/config.dev.js`.
- `out/config.js` no contiene URLs ni keys.
- No aparece el identificador del proyecto DEV en ningún archivo.
- `bridge.enc.js` está obfuscado y no contiene comentarios legibles del bridge.

Eliminar `out/` después.

## Prueba previa a release

Usar el instalador, no `npm start`.

1. Instalar Cipher.
2. Crear una licencia en PRODUCTION.
3. Activarla en el launcher.
4. Confirmar que carga HaxBall.
5. Confirmar que el bridge se inyecta.
6. Probar todas las features.
7. Revocar la licencia desde PRODUCTION.
8. Reiniciar el launcher.
9. Confirmar que muestra el rechazo.
10. Verificar ícono del ejecutable, instalador y barra de tareas.

No publicar si falla cualquiera de estos pasos.

## Release

Cuando `dev` esté estable:

```powershell
git checkout main
git pull origin main
git merge dev
git push origin main
git tag v1.0.0
git push origin v1.0.0
```

Luego construir desde `main` con las credenciales de producción.

Después del release:

```powershell
git checkout dev
```

## Versionado

- `PATCH` (`1.0.1`): correcciones sin features nuevas.
- `MINOR` (`1.1.0`): features compatibles nuevas.
- `MAJOR` (`2.0.0`): cambios incompatibles o rediseños grandes.

Actualizar `electron/package.json` antes de generar un instalador nuevo.

## Recuperación ante errores

### Una licencia válida aparece como inválida

Primero comprobar el entorno:

- `npm start` usa DEV.
- El instalador usa PRODUCTION.
- La licencia debe existir en el mismo entorno que usa el launcher.

### "Error: TypeError: Failed to fetch" al crear/validar licencias

`Failed to fetch` es un error de red del navegador, no de la base de datos.
La causa más común, sobre todo al volver tras un tiempo sin usar el proyecto,
es que **Supabase pausó el proyecto por inactividad** (free tier). Al pausarse,
Supabase quita el DNS y el host deja de resolver.

Diagnóstico rápido (reemplazar por el project ref real):

```powershell
nslookup TU-PROJECT-REF.supabase.co
```

- Si devuelve "Non-existent domain": el proyecto está pausado o eliminado.
- Si resuelve a una IP: el problema es otro (CORS, key mal, etc.).

Solución si está pausado:

1. Abrir el dashboard del proyecto en `supabase.com/dashboard`.
2. Pulsar "Restore" / "Resume project".
3. Esperar 1-2 minutos a que el DNS y la base vuelvan (los datos se conservan).

Para evitarlo en producción, considerar un plan pago o reanudar el proyecto
manualmente tras periodos de inactividad.

### Una credencial fue commiteada

1. No pushear.
2. Sacar el archivo del índice:

```powershell
git rm --cached ruta/del/archivo
```

3. Asegurar que esté en `.gitignore`.
4. Rehacer el commit.
5. Si llegó al remoto, rotar inmediatamente la key y limpiar la historia.

### El build falla

Confirmar que `config.prod.js` fue eliminado. `scripts/build.js` lo limpia en
un bloque `finally`, pero debe verificarse:

```powershell
Test-Path electron/config.prod.js
```

Debe devolver `False`.

## Pendientes de release

- Firma digital del instalador para reducir alertas de SmartScreen.
- Definir política de actualizaciones automáticas.
- Mantener un changelog por versión.
