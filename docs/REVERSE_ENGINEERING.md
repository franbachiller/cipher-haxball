# HaxBall — Ingeniería Inversa del Cliente (game-min.js)

**Fuente**: `game-min.js` v0349dd60 — 173KB minificado, 10448 líneas beautificado, 125+ clases.
**Autor**: Mario Carbajal (basro) — "HaxBall © Mario Carbajal - All rights reserved."

---

## 1. Arquitectura General

```
┌──────────────────────────────────────────────────────────────┐
│                     game-min.js (Cliente)                     │
├──────────────────────────────────────────────────────────────┤
│  UI Layer          │  Network Layer      │  Game Engine       │
│  ├─ xb (NickView)  │  ├─ qb (WS Server)  │  ├─ aa (Match)    │
│  ├─ Ya (RoomList)  │  ├─ Ca (RTCClient)  │  ├─ Wa (Physics)  │
│  ├─ ib (RoomView)  │  ├─ Pb (Connection) │  ├─ ta (Disc)     │
│  ├─ za (GameView)  │  ├─ dc (RTCPeer)    │  ├─ q  (Stadium)  │
│  ├─ Xa (ChatBox)   │  ├─ Ia (ClientRoom) │  ├─ I  (Segment)  │
│  ├─ hb (ScoreView) │  ├─ Zb (HostRoom)   │  ├─ G  (Vertex)   │
│  ├─ ma (Settings)  │  └─ $b (ReplayRoom) │  ├─ S  (Plane)    │
│  ├─ pb (CreateRoom)│                     │  ├─ lb (Goal)     │
│  ├─ mb (StadPicker)│  Protocol (p subs)  │  ├─ Ab (Joint)    │
│  ├─ Fa (ReplayCtrls│  ├─ Ja (Input)      │  ├─ Sb (PlayerPhy)│
│  ├─ Eb (PlayerInfo)│  ├─ ab (Chat)       │  ├─ ya (DiscDef)  │
│  ├─ Ba (PlayerList)│  ├─ Ha (PlayerJoin) │  └─ T  (Renderer) │
│  └─ vb (GeoChange) │  ├─ na (PlayerKick) │                    │
│                    │  ├─ fa (TeamChange) │  Data/IO            │
│  Util               │  ├─ Qa (AdminChg)  │  ├─ J  (BinReader) │
│  ├─ x  (DOM)       │  ├─ Oa (StadChange)│  ├─ A  (BinWriter) │
│  ├─ ha (String)    │  ├─ bb (StartGame) │  ├─ V  (Crypto)    │
│  ├─ lc (Settings)  │  ├─ cb (StopGame)  │  └─ Ta (Inflate)   │
│  ├─ ra (Storage)   │  ├─ db (Pause)     │                    │
│  ├─ Cc (URLParams) │  ├─ Aa (Limits)    │  Audio              │
│  └─ m  (Global)    │  ├─ Za (TeamColor) │  ├─ jc (AudioMgr)  │
│                    │  ├─ Pa (TeamLock)  │  └─ kc (CrowdSnd)  │
│                    │  ├─ La (KickRate)  │                    │
│                    │  ├─ Ma (Avatar)    │                    │
│                    │  ├─ Kb (Reorder)   │                    │
│                    │  ├─ Mb (DiscProps)  │                    │
│                    │  ├─ Ga (Pings)     │                    │
│                    │  ├─ eb (AutoTeam)  │                    │
│                    │  ├─ Ra (Recaptcha) │                    │
│                    │  ├─ Jb (Announce)  │                    │
│                    │  ├─ Lb (HostAvatar)│                    │
│                    │  ├─ Na (Activity)  │                    │
│                    │  └─ $a (Binary)    │                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Servidor WebSocket Central

**URL**: `wss://p2p.haxball.com/`
**API REST**: `https://www.haxball.com/rs/`

### Endpoints REST

| Endpoint | Respuesta | Descripción |
|----------|-----------|-------------|
| `/rs/api/geo` | `{"data":{"code":"AR","lat":-34.92,"lon":-57.95}}` | Geolocalización del cliente |
| `/rs/api/notice` | `{"data":{"content":""}}` | Avisos del servidor |
| `/rs/api/list` | Binary (custom format) | Lista de salas (protocolo binario propio) |

### Protocolo WebSocket (clase `qb`)

El WebSocket sirve para **señalización** — conectar peers vía WebRTC.

**Mensajes del servidor → cliente:**

| Byte ID | Método | Descripción |
|---------|--------|-------------|
| `1` | `Zh` | Solicitud de conexión entrante (SDP offer + ICE candidates) |
| `4` | `Yh` | ICE candidate adicional |
| `5` | `vp` | Room link asignado |
| `6` | `yp` | Token actualizado |

**Mensajes del cliente → servidor:**

| Byte ID | Método | Descripción |
|---------|--------|-------------|
| `0` | `Uc(0,...)` | Respuesta de conexión (accept/reject) |
| `1` | `Uc(1,...)` | SDP answer + ICE candidates |
| `4` | `Uc(4,...)` | ICE candidate |
| `7` | `Pi` | Room info update (estado de la sala) |
| `8` | `Oi` | Heartbeat/ping |
| `9` | `Cm` | Cambiar visibilidad (público/privado) |

### Autenticación

```
POST /rs/api/... → body: "token=<token>&rcr=<recaptcha>"
→ Response: { action: "connect", url: "wss://...", token: "..." }
           or { action: "recaptcha", sitekey: "..." }
```

---

## 3. Canales WebRTC

```javascript
wc.channels = [
    { name: "ro", reliable: true,  ordered: true  },  // Canal 0: reliable ordered
    { name: "ru", reliable: true,  ordered: false },  // Canal 1: reliable unordered
    { name: "uu", reliable: false, ordered: false }   // Canal 2: unreliable unordered
];
```

- **Canal 0 (ro)**: Mensajes de estado del juego, chat, acciones administrativas
- **Canal 1 (ru)**: Datos confiables sin orden (handshake, game state sync)
- **Canal 2 (uu)**: Datos no confiables (ping/latency measurements)

### ICE Servers

```javascript
m.kg = [{ urls: "stun:stun.l.google.com:19302" }];
```

---

## 4. Protocolo de Mensajes del Juego (clase `p`)

Todos los mensajes heredan de `p`. Se serializan/deserializan con un sistema binario propio.

### Registro de Mensajes (orden = ID del mensaje)

| ID | Clase | Nombre Inferido | delay | Ca | Descripción |
|----|-------|----------------|-------|----|-------------|
| 0 | `Ra` | SetRecaptcha | false | false | Toggle de reCAPTCHA en la sala |
| 1 | `Jb` | Announcement | false | false | Anuncio del host (rate: 10/900ms) |
| 2 | `eb` | AutoBalance | false | false | Auto-balance de equipos |
| 3 | `Aa` | SetLimits | false | false | Score/time limit change |
| 4 | `Qa` | AdminChange | false | false | Cambiar admin de jugador |
| 5 | `Ma` | SetAvatar | false | false | Override de avatar |
| 6 | `fa` | TeamChange | false | false | Mover jugador a equipo |
| 7 | `Oa` | StadiumChange | false | false | Cambiar estadio (deflate) |
| 8 | `Za` | TeamColors | false | false | Cambiar colores de equipo |
| 9 | `Pa` | TeamsLock | false | false | Lock/unlock equipos |
| 10 | `Ha` | PlayerJoin | false | false | Jugador entra a la sala |
| 11 | `Lb` | SetHostAvatar | false | false | Avatar del host sobre jugador |
| 12 | `db` | PauseGame | true | true | Pausar/despausar |
| 13 | `ab` | ChatMessage | false | false | Mensaje de chat (rate: 10/900ms, max 140 chars) |
| 14 | `Ja` | PlayerInput | true | true | Input del jugador (teclas) |
| 15 | `Na` | PlayerActivity | false | false | Señal de actividad |
| 16 | `na` | KickPlayer | false | false | Kick/ban jugador |
| 17 | `Kb` | ReorderPlayers | false | false | Reordenar lista |
| 18 | `Mb` | SetDiscProps | false | false | Modificar propiedades de disco |
| 19 | `La` | SetKickRate | false | false | Rate limit de patadas |
| 20 | `bb` | StartGame | false | false | Iniciar juego |
| 21 | `cb` | StopGame | false | false | Detener juego |
| 22 | `Ga` | SyncPings | false | false | Sincronizar pings |

### Protocolo Host↔Cliente (clase `Ia` — ClientRoom)

**Mensajes del host → cliente:**

| Byte ID | Handler | Descripción |
|---------|---------|-------------|
| `0` | `br` | Auth challenge (enviar auth key) |
| `1` | `ar` | Game state completo (deflateRaw, carga inicial) |
| `2` | `Yq` | Acción del juego (mensaje `p` serializado) |
| `3` | `gr` | Frame ack (sincronización) |
| `4` | `dr` | Ping response (latencia) |
| `5` | `$q` | Kick/ban notification |
| `6` | `fr` | Acción inmediata (no-delay) |

**Mensajes del cliente → host:**

| Byte ID | Handler | Descripción |
|---------|---------|-------------|
| `0` | — | Auth response |
| `1` | — | Acción del juego |
| `2` | — | Ping request |

---

## 5. Motor de Físicas

### Clase `Wa` (World/Physics Engine)

El mundo físico contiene:
- `H[]` — Array de discos (`ta`) — incluye la pelota (index 0) y jugadores
- `sa[]` — Array de planos (`S`) — paredes infinitas
- `X[]` — Array de segmentos (`I`) — paredes finitas
- `L[]` — Array de vértices (`G`) — puntos de colisión
- `rb[]` — Array de joints (`Ab`) — conexiones entre discos

### Simulación (método `Wa.A(deltaTime)`)

```
Por cada tick (60fps):
  1. Mover discos: pos += vel * dt
  2. Aplicar gravedad y damping: vel = (vel + gravity) * damping
  3. Colisiones disco↔disco (yo): rebote elástico con bCoeff
  4. Colisiones disco↔plano (sa): reflexión contra paredes infinitas
  5. Colisiones disco↔segmento (X): reflexión contra paredes finitas
  6. Colisiones disco↔vértice (L): rebote contra puntos
  7. Resolver joints (2 iteraciones)
```

### Clase `ta` (Disc — Entidad física)

```javascript
{
    a: P(x, y),        // Posición
    G: P(x, y),        // Velocidad
    ra: P(x, y),       // Gravedad
    V: float,           // Radio
    o: float,           // Coeficiente de rebote (bounce)
    ca: float,          // Masa inversa (0 = inmóvil)
    Ea: float,          // Damping (ej: 0.99)
    S: int,             // Color (0xRRGGBB)
    i: int,             // Collision mask (qué golpea)
    C: int,             // Collision group (a qué pertenece)
}
```

### Clase `Sb` (Player Physics)

```javascript
{
    V: float,           // Radio del jugador (default 15)
    o: float,           // Bounce (default 0.5)
    ca: float,          // Inverse mass (default 0.5)
    Ea: float,          // Damping (default 0.96)
    Qe: float,          // Aceleración normal (default 0.1)
    gf: float,          // Aceleración pateando (default 0.07)
    hf: float,          // Damping pateando (default 0.96)
    ef: float,          // Fuerza de patada (default 5)
    ff: float,          // Kickback (retroceso del jugador)
    ra: P(x, y),        // Gravedad del jugador
    C: int,             // Collision group
}
```

### Clase `aa` (Match State)

```javascript
{
    va: Wa,             // World (motor físico)
    Cb: int,            // Estado: 0=waiting, 1=playing, 2=goal, 3=victory
    Tb: int,            // Score red
    Ob: int,            // Score blue
    Nc: float,          // Tiempo transcurrido (segundos)
    Ta: int,            // Pause countdown (120 = pausado)
    le: u,              // Último equipo que anotó
    zc: int,            // Countdown (150 tras gol, 300 tras victoria)
    mb: int,            // Score limit
    Ga: int,            // Time limit (minutos)
    U: q,               // Stadium actual
}
```

### Input del Jugador (clase `Ja`)

```javascript
// Bitmask de input:
// bit 0 (1):  Up
// bit 1 (2):  Down
// bit 2 (4):  Left
// bit 3 (8):  Right
// bit 4 (16): Kick
```

El jugador envía `Ja` con su bitmask de teclas. El host aplica el input en el siguiente tick.

### Detección de Gol

En `aa.A()`:
1. Cuando `Cb == 1` (playing), se monitorea si la pelota cruza algún `Goal` (clase `lb`)
2. Los goals tienen dos puntos (`$`, `ea`) y un equipo (`Be`)
3. La detección usa intersección de líneas entre la posición previa y actual de la pelota
4. Tras gol: `Cb = 2`, countdown de 150 ticks, luego reset de posiciones

---

## 6. Equipos (clase `u`)

```javascript
u.Pa = new u(0, 0xFFFFFF, 0,  -1, "Spectators", "t-spec", 0, 0);  // Spectators
u.ja = new u(1, 0xE56E56, -1,  8, "Red",        "t-red",  0xE56E56, 2);  // Red
u.Da = new u(2, 0x5689E5, 1,  16, "Blue",       "t-blue", 0x098AC8, 4);  // Blue
```

### Collision Groups

```
Spectators: C = 0
Red:        C = 2  (bit 1)
Blue:       C = 4  (bit 2)
Ball:       C = 192 (bits 6+7, 64+128)
Wall:       varies
Kick:       bit 6 (64)
Score:      bit 7 (128)
```

---

## 7. Estadio (clase `q`)

Formato `.hbs` = JSON con estas propiedades:

```javascript
{
    D: string,          // name
    bc: float,          // width
    tc: float,          // height
    mc: float,          // spawnDistance (default 200)
    bd: float,          // kickOffRadius
    Gc: float,          // cornerRadius
    Te: float,          // goalLine
    ud: int,            // bgType: 0=none, 1=grass, 2=hockey
    ce: float,          // bgWidth
    be: float,          // bgHeight
    td: int,            // bgColor (default 0x719ECB)
    mf: int,            // maxViewWidth
    Ue: int,            // cameraFollow: 0=ball, 1=player
    $f: bool,           // canBeStored
    Df: bool,           // kickOffReset: full or partial
    Kd: Sb,             // playerPhysics
    L: G[],             // vertexes
    X: I[],             // segments
    sa: S[],            // planes
    wc: lb[],           // goals
    H: ya[],            // discs (index 0 = ball)
    rb: Ab[],           // joints
    Md: P[],            // redSpawnPoints
    vd: P[],            // blueSpawnPoints
}
```

### Estadios Default (codificados internamente)

Accesibles via `q.Uh()` — incluyen: Classic, Easy, Small, Big, Rounded, Hockey, Big Hockey, Big Easy, Big Rounded, Huge.

---

## 8. Player State (clase `wa`)

```javascript
{
    Z: int,             // ID único del jugador
    D: string,          // Nombre
    fa: u,              // Equipo (u.Pa/u.ja/u.Da)
    cb: bool,           // Es admin
    I: ta,              // Disco del jugador (null si spectator)
    W: int,             // Input bitmask actual
    Yb: bool,           // ¿Está pateando?
    Zc: int,            // Kick cooldown
    Cc: int,            // Kick counter
    Nb: int,            // Spawn order
    Zb: string,         // Avatar (2 chars max)
    Sd: string,         // Avatar override (del host)
    Ud: bool,           // reCAPTCHA verificado
    zb: int,            // Ping
    country: string,    // País (código)
}
```

---

## 9. Serialización Binaria

### Clase `J` (BinaryReader)

```javascript
F()     → uint8
zf()    → int8
Sb()    → uint16
Ci()    → int16
N()     → int32
kb()    → uint32
Bi()    → float32
w()     → float64
Bb()    → varint (LEB128)
kc()    → string (varint length + UTF-8)
Ab()    → nullable string (0 = null, else length+1)
Jg()    → JSON (string → JSON.parse)
```

### Clase `A` (BinaryWriter)

```javascript
m(v)    → write int8
Xb(v)   → write uint16
R(v)    → write int32
tb(v)   → write uint32
u(v)    → write float64
pb(v)   → write varint
oc(s)   → write string (varint + UTF-8)
Eb(s)   → write nullable string
Lb(buf) → write raw bytes
Yg(buf) → write arraybuffer
```

---

## 10. Vendor Libraries

| Archivo | Tamaño | Función |
|---------|--------|---------|
| `pako-jszip.min.js` | 74KB | Compresión deflate/inflate (se usa para game state y estadios) |
| `json5.min.js` | 3.3KB | Parser JSON5 (para archivos .hbs de estadios) |
| `perfect-scrollbar.min.js` | 18KB | Scrollbars customizados |
| `modernizr-custom.js` | 6KB | Feature detection (canvas, websockets, webrtc, etc.) |

---

## 11. Assets

| Archivo | Tamaño | Contenido |
|---------|--------|-----------|
| `res.dat` | 187KB | Bundle de recursos (sonidos WAV/OGG, probablemente) |
| `flags.png` | 22KB | Spritesheet de banderas de países |
| `haxball.png` | 15KB | Logo |
| `bg.png` | 617B | Background tile |
| `fontello.woff2` | 6.4KB | Iconos (fontello) |

### Contenido de res.dat (extraído via AudioContext.decodeAudioData)

```
sounds/chat.wav
sounds/highlight.wav
sounds/kick.wav
sounds/goal.wav
sounds/join.wav
sounds/leave.wav
sounds/crowd.ogg
```

---

## 12. Flujo de Conexión Completo

```
1. Cliente abre haxball.com/play
2. Carga game-min.js + vendors + res.dat
3. POST /rs/api/ con token → obtiene URL WebSocket + token
4. Conecta a wss://p2p.haxball.com/?token=...
5. Recibe lista de salas (GET /rs/api/list, formato binario)
6. Al elegir sala:
   a. WS server intercambia SDP offer/answer + ICE candidates
   b. Se establece WebRTC DataChannel (3 canales: ro, ru, uu)
   c. Host envía game state completo (deflateRaw)
   d. Cliente comienza a recibir acciones por canal ro
   e. Cliente envía inputs (Ja) al host
7. Simulación corre a 60fps en el host
8. Cliente interpola/extrapola para render suave
```

---

## 13. Room List Binary Protocol

El endpoint `/rs/api/list` devuelve datos binarios parseados por `Qb.parse()`:

```
Para cada sala:
  - name: string (varint length)
  - data: binary blob (varint length), contiene:
    - Rb (RoomInfo object):
      - Jc: float (latitud)
      - Mc: float (longitud)
      - (otros campos del room)
    - ba: string (room ID)
```

La distancia se calcula con la fórmula de Haversine (`Qb.Zs`):
```
d = 6378 * acos(sin(lat1)*sin(lat2) + cos(lat1)*cos(lat2)*cos(lon1-lon2))
```

---

## 14. Acceso al Game State en Runtime (para Bot)

### Estructura del Objeto Global

Desde el cliente modificado (Haxball-Client-Expansion), `window.g` expone:

```
window.g
├── getRoomManager()           → roomManager (el controlador activo)
│   ├── room                   → Ia (ClientRoom) o Zb (HostRoom)
│   │   ├── playerId           → int (nuestro ID = yc)
│   │   ├── roomState          → va (el game state completo)
│   │   │   ├── name           → string
│   │   │   ├── players[]      → wa[] (todos los jugadores)
│   │   │   │   ├── id         → Z (int)
│   │   │   │   ├── name       → D (string)
│   │   │   │   ├── team       → fa.ba (0=spec, 1=red, 2=blue)
│   │   │   │   ├── admin      → cb (bool)
│   │   │   │   ├── disc       → I (ta object, null si spectator)
│   │   │   │   │   ├── x      → I.a.x
│   │   │   │   │   ├── y      → I.a.y
│   │   │   │   │   ├── vx     → I.G.x
│   │   │   │   │   └── vy     → I.G.y
│   │   │   │   └── input      → W (bitmask)
│   │   │   ├── game           → M (aa object, null si no hay juego)
│   │   │   │   ├── world      → M.va (Wa, motor de físicas)
│   │   │   │   │   └── discs  → M.va.H[] (ta[], incluye pelota en [0])
│   │   │   │   ├── scoreRed   → M.Tb
│   │   │   │   ├── scoreBlue  → M.Ob
│   │   │   │   ├── time       → M.Nc (segundos)
│   │   │   │   ├── state      → M.Cb (0=wait,1=play,2=goal,3=victory)
│   │   │   │   └── paused     → M.Ta (120=pausado)
│   │   │   ├── stadium        → U (q object)
│   │   │   └── teamsLocked    → Bc (bool)
│   │   └── T                  → va (alias directo al roomState)
│   ├── roomLink               → string (URL de la sala)
│   └── sendChat(msg)          → función para enviar chat
├── getPlayer(id)              → PlayerObject
├── getPlayerList()            → PlayerObject[]
└── line                       → { enabled: bool } (aim line)
```

### Rutas al Game State (nombres minificados)

Para leer el game state desde JavaScript inyectado:

```javascript
// Desde la clase Da (controlador):
// this.za = room connection (Ia/Zb)
// this.za.T = game state (va)
// this.za.yc = nuestro player ID

// Desde el game state (va):
// va.K = player array
// va.M = match state (aa), null si no hay juego
// va.U = stadium (q)
// va.lc = room name
// va.Bc = teams locked

// Desde el match (aa):
// aa.va = physics world (Wa)
// aa.va.H = all discs (ta[]), index 0 = pelota
// aa.Tb = red score
// aa.Ob = blue score
// aa.Nc = time elapsed
// aa.Cb = state (0=waiting, 1=playing, 2=goal scored, 3=victory)

// Desde un player (wa):
// wa.Z = id
// wa.D = name
// wa.fa = team (u object, .ba = 0/1/2)
// wa.I = player disc (ta), null if spectator
// wa.I.a.x, wa.I.a.y = position
// wa.I.G.x, wa.I.G.y = velocity
// wa.W = input bitmask (1=up, 2=down, 4=left, 8=right, 16=kick)

// Pelota:
// state.M.va.H[0].a.x, state.M.va.H[0].a.y = ball position
// state.M.va.H[0].G.x, state.M.va.H[0].G.y = ball velocity
```

### Inyección de Input

El input se envía via la clase `bc` como bitmask:

```javascript
// Crear y enviar un input:
let input = new Ja();  // Clase de mensaje PlayerInput
input.input = 0;
// bit 0 (1):  Up
// bit 1 (2):  Down
// bit 2 (4):  Left
// bit 3 (8):  Right
// bit 4 (16): Kick

input.input = 4 | 16;  // Left + Kick = patada a la izquierda
room.ta(input);         // Enviar al host
```

### Enfoque Playwright para Bot Jugador

```
1. Abrir Chromium con Playwright
2. Cargar haxball.com/play
3. Inyectar game-mod.js (override) para exponer window.g
4. Entrar a sala (o crear una)
5. Loop a 60fps:
   a. Leer game state via window.g.getRoomManager()
   b. Calcular decisión de IA (posición, dirección, patear)
   c. Simular keyboard events para mover al bot
   d. O inyectar directamente el input bitmask
```

---

## 15. Constantes Importantes

```javascript
m.Js = "wss://p2p.haxball.com/";          // WebSocket server
m.Se = "https://www.haxball.com/rs/";      // REST API base
m.kg = [{urls: "stun:stun.l.google.com:19302"}];  // STUN server

// Decompression buffer
Kc = new Uint8Array(51200);                // 50KB inflate buffer

// Limits
Chat: max 140 chars, rate 10 msgs / 900ms
Announcement: max 1000 chars, rate 10 / 900ms
Avatar: max 2 chars
Room name: max 40 chars
Password: max 30 chars
Kick reason: max 100 chars
Stadium: max 255 vertexes, segments, planes, goals, discs
```
