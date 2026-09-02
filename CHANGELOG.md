# Changelog

Los cambios relevantes de Cipher se documentan aquí por versión. Las fechas
usan `YYYY-MM-DD` y los hashes corresponden al instalador local auditado; los
binarios de `electron/dist/` no se commitean al repositorio.

## [1.1.0] - 2026-09-02

- Commit de release: `ffe8ab4`
- Tag: `v1.1.0`
- Instalador: `electron/dist/Cipher Setup 1.1.0.exe`
- SHA-256: `675F03BD3482F33E13B1054F1257C1AB50E4EE696F02A396E87D19D070EBE857`

### Added

- Panel de control in-game, oculto inicialmente y con apertura/cierre mediante
  `Insert`.
- Controles sincronizados para Aim Assist (`F8`), AI Bot (`F9`) y OP Mode
  (`Ctrl`), incluido el valor absoluto de OP Mode entre 0 y 120.
- API `window.__hax__.togglePanel([open])` para controlar el panel desde el
  bridge.

### Changed

- Aim Assist ahora calcula la trayectoria en un mundo físico aislado usando el
  motor real `Wa.A`: respeta radio, gravedad, damping, máscaras de colisión,
  `bCoef`, planos, segmentos rectos/curvos y vértices del estadio activo.
- La trayectoria pasó de 60 a 180 ticks.
- La línea de aim usa rojo fuerte `#ff2028`, mayor grosor, extremos redondeados
  y un glow corto para conservar contraste sobre el campo.
- La CSP del login ya no contiene identificadores de proyectos Supabase. Las
  llamadas de licencia continúan realizándose desde el proceso principal por
  IPC.
- El footer del panel muestra únicamente `Insert to hide`; se eliminó el texto
  `Bridge online`.

### Validation

- `node --check src/inject/bridge.js`.
- Parseo del bridge insertado en el `game-min.js` capturado mediante el anchor
  exacto `B.$p()})`.
- Checks numéricos de rebote contra un plano y un segmento usando las clases
  físicas recuperadas del juego.
- Prueba manual en DEV de movimiento normal, panel, Aim Assist, AI Bot y OP
  Mode; el rebote y la nueva presentación fueron confirmados visualmente.
- Auditoría del ASAR: versión `1.1.0`, sólo configuración PROD, ausencia de
  `config.dev.js`, URLs DEV y `service_role`, y bridge obfuscado.
- Instalación silenciosa local; el ASAR instalado coincidió por hash con el
  artefacto auditado.

No se repitió sobre el instalador final el ciclo completo de crear, activar y
revocar una licencia PROD. El flujo de licencia PROD se había probado durante
la preparación del release.

### Known limitations

- No existe auto-updater: los clientes de `1.0.0` deben ejecutar manualmente el
  nuevo instalador.
- El instalador no tiene firma digital y Windows puede mostrar SmartScreen.
- `npm ci` reportó 5 vulnerabilidades de severidad alta en dependencias
  heredadas. No se ejecutó `npm audit fix` durante el release para evitar una
  actualización incompatible sin revisión específica.

## [1.0.0] - 2026-08-30

- Baseline de producción: commit `dd9f50e`, tag `v1.0.0`.
- Instalador preservado: `electron/dist/Cipher Setup 1.0.0.exe`.
- SHA-256: `181F16E3FF6EC45058F611280164ACE68A82B2880438B32A873CBDA5A67EAF41`.
