# HaxBall — Reconocimiento e Ingeniería Inversa

## 1. ¿Qué es HaxBall?

Juego multijugador de fútbol 2D basado en físicas, creado por **Mario Carbajal** (GitHub: `basro`).
Corre 100% en el navegador desde [haxball.com](https://www.haxball.com).

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Renderizado** | HTML5 Canvas |
| **Lenguaje** | JavaScript (minificado como `game-min.js`) |
| **Networking** | WebRTC DataChannels (peer-to-peer) |
| **Señalización** | WebSocket al servidor central de HaxBall |
| **Audio** | Web Audio API |
| **Storage** | LocalStorage (nick, preferencias) |
| **Detección de features** | Modernizr (canvas, dataview, websockets, es6collections, promises, peerconnection, datachannel) |

### Archivos clave del cliente

```
haxball.com/
├── play                          # Página del juego (iframe a game.html)
├── headless                      # Página headless host (iframe a headless.html)
├── headlesstoken                 # Obtener token para bypass de reCAPTCHA
├── Euw8T3YR/__cache_static__/g/
│   ├── game.html                 # Shell HTML del juego
│   ├── game.css                  # Estilos
│   ├── game-min.js               # Cliente completo (minificado/ofuscado)
│   ├── headless.html             # Shell HTML del headless host
│   ├── headless-min.js           # API headless (minificado)
│   ├── icons/css/fontello.css    # Iconos
│   └── images/haxball.png        # Logo
```

> **Nota**: `Euw8T3YR` es un hash de cache-busting que cambia con las actualizaciones.

---

## 3. Arquitectura de Red

```
┌──────────┐     WebSocket      ┌─────────────────┐
│  Cliente  │◄──────────────────►│ Servidor Central │
│ (Browser) │   (señalización)  │   (haxball.com)   │
└──────────┘                    └─────────────────┘
      │                                │
      │  WebRTC DataChannel            │  Lista de salas
      │  (P2P directo)                 │  Matchmaking
      ▼                                │
┌──────────┐                           │
│   Host   │◄──────────────────────────┘
│ (Browser │   WebRTC DataChannel
│  o VPS)  │   (datos del juego)
└──────────┘
```

### Modelo de red: Host-autoritativo sobre WebRTC

- **El host ES el servidor del juego**. No hay servidor dedicado — un jugador (o un headless host) actúa como autoridad.
- Los **clientes se conectan al host vía WebRTC DataChannels** (P2P).
- El **servidor central de haxball.com** solo maneja:
  - Lista de salas públicas
  - Señalización WebRTC (intercambio de SDP/ICE candidates)
  - reCAPTCHA para crear salas
- La **simulación de físicas corre en el host** a 60 ticks/segundo.
- Los clientes envían inputs (teclas presionadas) y reciben el estado del juego.

### Implicación para VPS

Chrome necesita flag `--disable-features=WebRtcHideLocalIpsWithMdns` en VPS para que WebRTC funcione correctamente.

---

## 4. API Headless Host (Oficial)

URL: `https://html5.haxball.com/headless` (o `https://www.haxball.com/headless`)

Documentación oficial: https://github.com/haxball/haxball-issues/wiki/Headless-Host

### Inicialización

```javascript
var room = HBInit({
    roomName: "Mi sala",
    maxPlayers: 16,
    noPlayer: true,       // Sin jugador host (recomendado)
    public: true,         // Visible en lista de salas
    token: "token-aquí",  // Bypass de reCAPTCHA (obtener en /headlesstoken)
    password: null,       // Sin contraseña
    geo: { code: "AR", lat: -34.6, lon: -58.4 }
});
```

### Métodos del RoomObject

| Método | Descripción |
|--------|-------------|
| `sendChat(msg, targetId?)` | Enviar mensaje de chat |
| `sendAnnouncement(msg, targetId?, color?, style?, sound?)` | Anuncio del host |
| `setPlayerAdmin(id, admin)` | Cambiar admin |
| `setPlayerTeam(id, team)` | Mover a equipo (0=spec, 1=red, 2=blue) |
| `kickPlayer(id, reason, ban)` | Kickear/banear |
| `clearBan(id)` / `clearBans()` | Limpiar bans |
| `setScoreLimit(n)` / `setTimeLimit(min)` | Configurar partido |
| `startGame()` / `stopGame()` / `pauseGame(bool)` | Control del juego |
| `getPlayerList()` | Lista de jugadores |
| `getPlayer(id)` | Info de un jugador |
| `getScores()` | Marcador actual |
| `getBallPosition()` | Posición de la pelota |
| `setCustomStadium(hbs)` / `setDefaultStadium(name)` | Cambiar estadio |
| `setTeamColors(team, angle, textColor, colors[])` | Colores de equipo |
| `setDiscProperties(idx, props)` / `getDiscProperties(idx)` | Props de discos |
| `setPlayerDiscProperties(id, props)` / `getPlayerDiscProperties(id)` | Props de disco de jugador |
| `getDiscCount()` | Cantidad de discos |
| `startRecording()` / `stopRecording()` | Grabar replay |
| `setPassword(pass)` | Cambiar contraseña |
| `setRequireRecaptcha(bool)` | Requerir reCAPTCHA |
| `reorderPlayers(ids[], moveToTop)` | Reordenar lista |
| `setKickRateLimit(min, rate, burst)` | Limitar patadas |
| `setPlayerAvatar(id, avatar)` | Override de avatar |
| `setTeamsLock(bool)` | Bloquear equipos |
| `CollisionFlags` | Constantes de colisión |

### Eventos

| Evento | Firma |
|--------|-------|
| `onPlayerJoin` | `(player)` |
| `onPlayerLeave` | `(player)` |
| `onPlayerChat` | `(player, msg) → bool` (return false filtra) |
| `onPlayerBallKick` | `(player)` |
| `onPlayerActivity` | `(player)` |
| `onPlayerAdminChange` | `(changed, byPlayer)` |
| `onPlayerTeamChange` | `(changed, byPlayer)` |
| `onPlayerKicked` | `(kicked, reason, ban, byPlayer)` |
| `onTeamGoal` | `(team)` |
| `onTeamVictory` | `(scores)` |
| `onGameStart` | `(byPlayer)` |
| `onGameStop` | `(byPlayer)` |
| `onGameTick` | `()` — 60 fps |
| `onGamePause` | `(byPlayer)` |
| `onGameUnpause` | `(byPlayer)` |
| `onPositionsReset` | `()` |
| `onStadiumChange` | `(name, byPlayer)` |
| `onRoomLink` | `(url)` |
| `onKickRateLimitSet` | `(min, rate, burst, byPlayer)` |
| `onTeamsLockChange` | `(locked, byPlayer)` |

### Objetos de datos

**PlayerObject:**
```
{ id, name, team, admin, position: {x, y}, auth, conn }
```

**ScoresObject:**
```
{ red, blue, time, scoreLimit, timeLimit }
```

**DiscPropertiesObject:**
```
{ x, y, xspeed, yspeed, xgravity, ygravity, radius, bCoeff, invMass, damping, color, cMask, cGroup }
```

---

## 5. Ecosistema de Herramientas Existentes

### Bibliotecas para Bots

| Proyecto | Descripción | Enfoque |
|----------|-------------|---------|
| [**haxball.js**](https://github.com/mertushka/haxball.js) | Wrapper de headless-min.js para Node.js | **Aprobado por basro**. Usa WebRTC nativo en Node. ~30% de las salas lo usan. |
| [**node-haxball**](https://github.com/wxyz-abcd/node-haxball) | Cliente/host completo reverse-engineered | **No aprobado por basro**. API completa: host + client + standalone. |
| [**@haxball-bot/bot**](https://www.npmjs.com/package/@haxball-bot/bot) | Wrapper con sistema de eventos mejorado | Sistema de behaviors, antiflood, bans por votación. |
| [**haxroomie**](https://github.com/morko/haxroomie) | Framework con Puppeteer | Corre headless real en browser sin GUI. Plugin system (HHM). |

### Herramientas de Modificación del Cliente

| Proyecto | Descripción |
|----------|-------------|
| [**Haxball-Client-Expansion**](https://github.com/ChasmSolacer/Haxball-Client-Expansion) | game-min.js modificado que expone funciones del headless en el cliente. Usa Chrome Local Overrides. |
| **HaxApp** | Cliente Electron no oficial (basro pidió que se baje). |

---

## 6. Posición Legal del Autor

Basro (Mario Carbajal) dejó clara su posición en [Issue #1805](https://github.com/haxball/haxball-issues/issues/1805):

- **HaxBall es closed-source**. La ingeniería inversa y distribución de versiones modificadas **no está permitida**.
- **node-haxball** y **HaxApp** son explícitamente problemáticos para él.
- **haxball.js** (mertushka) **SÍ está permitido** — solo wrappea el headless-min.js oficial para Node.js sin modificar código base.
- Modificaciones menores al headless para seguridad (anti-VPN, etc.) son **toleradas**.
- Basro expresó interés futuro en hacer un módulo Node.js oficial.

### Implicación para nuestro proyecto

**Enfoque recomendado**: Construir sobre la **API Headless oficial** (vía `haxball.js` o directamente con Puppeteer). Esto es legal, aprobado por el autor, y estable.

---

## 7. Estrategias de Implementación del Bot

### Opción A: haxball.js (Node.js nativo) ← **RECOMENDADA**

```
npm install haxball.js
```

```javascript
const HaxballJS = require('haxball.js').default;

HaxballJS().then((HBInit) => {
    const room = HBInit({
        roomName: "Bot Room",
        maxPlayers: 16,
        noPlayer: true,
        token: "tu-token"
    });

    room.onPlayerJoin = (player) => {
        room.sendChat(`Bienvenido ${player.name}!`);
    };
});
```

**Pros**: Nativo Node.js, sin browser, aprobado por basro, acceso a filesystem/DB.
**Contras**: Requiere Node.js >= 22.18, depende de WebRTC nativo.

### Opción B: Puppeteer + Headless Page

```javascript
const puppeteer = require('puppeteer');

const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-features=WebRtcHideLocalIpsWithMdns']
});
const page = await browser.newPage();
await page.goto('https://www.haxball.com/headless');
await page.evaluate(() => {
    // Inyectar script del bot
});
```

**Pros**: Entorno real del browser, siempre actualizado.
**Contras**: Pesado (Chrome completo), más complejo de mantener.

### Opción C: node-haxball (reverse-engineered) ← **NO RECOMENDADA**

Completa pero explícitamente rechazada por basro. Permite actuar como cliente (no solo host), pero tiene riesgo legal/ético.

---

## 8. Capacidades del Bot vía API Headless

Lo que **SÍ** se puede hacer:
- Gestión de sala completa (kick, ban, admin, equipos, contraseña)
- Sistema de comandos por chat (`!help`, `!stats`, `!swap`)
- Auto-balance de equipos
- Estadísticas de jugadores (goles, asistencias, actividad)
- Grabación/reproducción de replays
- Mapas personalizados (.hbs)
- Manipulación de discos (posición, velocidad, gravedad)
- Detección de goles y anuncios
- Detección de inactividad (AFK kick)
- Colores de equipo dinámicos
- Rate limiting de patadas

Lo que **NO** se puede hacer con la API oficial:
- Controlar un jugador (mover, patear) — solo el host sin jugador
- Leer inputs de jugadores individuales
- Modificar la simulación de físicas en tiempo real (más allá de disc properties)
- Acceder al rendering/canvas
- Interceptar tráfico WebRTC raw

---

## 9. Física del Juego

- **Tick rate**: 60 fps (cada ~16.67ms)
- **Modelo**: Discos 2D con colisiones circulares
- **Propiedades de disco**: posición (x,y), velocidad (xspeed, yspeed), gravedad, radio, coeficiente de rebote (bCoeff), masa inversa (invMass), damping
- **Collision flags**: ball, red, blue, wall, kick, score, c0-c3 (customizables)
- **Estadios**: Formato .hbs (JSON) con definiciones de segmentos, vértices, discos, goals, joints

---

## 10. Próximos Pasos

1. **Inicializar proyecto Node.js** con `haxball.js`
2. **Obtener headless token** desde haxball.com/headlesstoken
3. **Implementar bot base** con:
   - Conexión y creación de sala
   - Sistema de comandos
   - Auto-admin
   - Logging
4. **Añadir módulos**:
   - Estadísticas de jugadores
   - Anti-AFK
   - Auto-balance
   - Mapas personalizados
5. **Persistencia**: Base de datos para stats/bans (SQLite o similar)
