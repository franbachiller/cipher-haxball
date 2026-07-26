# HaxBall Symbol Dictionary
# Maps minified names → real names (inferred from usage, structure, and HaxballGym)

## Core Game Classes

| Min | Real Name | Description |
|-----|-----------|-------------|
| `va` | **GameState** | Root game state: players, match, stadium, settings |
| `aa` | **Match** | Active match: physics world, scores, timer, state machine |
| `Wa` | **World** | Physics world: array of discs, resolves collisions |
| `ta` | **Disc** | Physics disc: pos, vel, radius, mass, damping, collision flags |
| `ya` | **DiscDef** | Disc definition in stadium (template for discs) |
| `Sb` | **PlayerPhysics** | Player physics params: accel, kick force, damping |
| `wa` | **Player** | Player instance: id, name, team, disc, input, admin |
| `q` | **Stadium** | Stadium/map: vertices, segments, planes, goals, discs, spawns |
| `u` | **Team** | Team enum (Pa=Spectators, ja=Red, Da=Blue) |
| `xa` | **TeamColors** | Team color config: angle, text color, stripe colors |

## Stadium Geometry

| Min | Real Name | Fields |
|-----|-----------|--------|
| `G` | **Vertex** | `a:P(x,y)`, `o:bCoef`, `i:cMask`, `C:cGroup`, `Dd:index` |
| `I` | **Segment** | `$:v0`, `ea:v1`, `vb:curve`, `Hc:bias`, `o:bCoef`, `ya:normal`, `ge:center`, `uk:radius` |
| `S` | **Plane** | `ya:P(normal)`, `Va:dist`, `o:bCoef`, `i:cMask`, `C:cGroup` |
| `lb` | **Goal** | `$:P(p0)`, `ea:P(p1)`, `Be:team` |
| `Ab` | **Joint** | `ie:disc0idx`, `he:disc1idx`, `fc:length`, `Ib:maxLength`, `ze:strength` |

## Physics/Math

| Min | Real Name | Description |
|-----|-----------|-------------|
| `P` | **Vec2** | 2D vector: `{x, y}` |
| `Jc` | **Vec2Alt** | Alternative Vec2 (same structure) |

## Disc Properties (class `ta`)

| Min | Real | Type | Default | Description |
|-----|------|------|---------|-------------|
| `a` | **pos** | `P` | (0,0) | Position |
| `G` | **vel** | `P` | (0,0) | Velocity |
| `ra` | **gravity** | `P` | (0,0) | Per-tick gravity |
| `V` | **radius** | `float` | 10 | Collision radius |
| `o` | **bCoef** | `float` | 0.5 | Bounce coefficient |
| `ca` | **invMass** | `float` | 1 | Inverse mass (0=static) |
| `Ea` | **damping** | `float` | 0.99 | Velocity damping per tick |
| `S` | **color** | `int` | 0xFFFFFF | RGB color |
| `i` | **cMask** | `int` | 63 | Collision mask (what I collide with) |
| `C` | **cGroup** | `int` | 63 | Collision group (what I am) |
| `ek` | **trait** | `int` | 0 | Trait reference |

## Player Properties (class `wa`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `Z` | **id** | `int` | Unique player ID |
| `D` | **name** | `string` | Display name |
| `fa` | **team** | `u` | Team (`.ba` = 0/1/2) |
| `cb` | **admin** | `bool` | Has admin rights |
| `I` | **disc** | `ta` | Player's disc (null if spectator) |
| `W` | **input** | `int` | Current input bitmask |
| `Yb` | **kicking** | `bool` | Currently kicking |
| `Zc` | **kickCooldown** | `int` | Ticks until can kick again |
| `Cc` | **kickCounter** | `int` | Kick burst counter |
| `Nb` | **spawnOrder** | `int` | Position in spawn order |
| `Zb` | **avatar** | `string` | Player avatar (2 chars) |
| `Sd` | **avatarOverride** | `string` | Host-set avatar override |
| `Ud` | **verified** | `bool` | reCAPTCHA verified |
| `zb` | **ping** | `int` | Latency in ms |
| `country` | **country** | `string` | Country code |

## Match Properties (class `aa`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `va` | **world** | `Wa` | Physics world |
| `Cb` | **state** | `int` | 0=kickoff, 1=playing, 2=goal, 3=victory |
| `Tb` | **scoreRed** | `int` | Red team score |
| `Ob` | **scoreBlue** | `int` | Blue team score |
| `Nc` | **time** | `float` | Elapsed time (seconds) |
| `Ta` | **pauseTimer** | `int` | 120=paused, counts down |
| `le` | **lastScoringTeam** | `u` | Team that last scored |
| `zc` | **countdown** | `int` | Post-goal/victory countdown |
| `mb` | **scoreLimit** | `int` | Score limit |
| `Ga` | **timeLimit** | `int` | Time limit (minutes) |
| `U` | **stadium** | `q` | Current stadium |
| `Sa` | **gameState** | `va` | Parent game state ref |

## GameState Properties (class `va`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `K` | **players** | `wa[]` | All players |
| `M` | **match** | `aa` | Active match (null=no game) |
| `U` | **stadium** | `q` | Current stadium |
| `lc` | **roomName** | `string` | Room name |
| `Bc` | **teamsLocked** | `bool` | Teams locked |
| `mb` | **scoreLimit** | `int` | Score limit |
| `Ga` | **timeLimit** | `int` | Time limit |
| `Gd` | **kickRateMin** | `int` | Min ticks between kicks |
| `gd` | **kickRateCost** | `int` | Kick burst cost |
| `ne` | **kickRateCap** | `int` | Kick burst capacity |
| `ob` | **teamColors** | `xa[3]` | Team colors [null, red, blue] |

## Stadium Properties (class `q`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `D` | **name** | `string` | Stadium name |
| `bc` | **width** | `float` | Field half-width |
| `tc` | **height** | `float` | Field half-height |
| `mc` | **spawnDistance** | `float` | Kickoff spawn distance |
| `bd` | **kickOffRadius** | `float` | Center circle radius |
| `Gc` | **cornerRadius** | `float` | Corner radius |
| `Te` | **goalLine** | `float` | Goal line offset |
| `ud` | **bgType** | `int` | 0=none, 1=grass, 2=hockey |
| `ce` | **bgWidth** | `float` | Background width |
| `be` | **bgHeight** | `float` | Background height |
| `td` | **bgColor** | `int` | Background color |
| `mf` | **maxViewWidth** | `int` | Max camera view width |
| `Ue` | **cameraFollow** | `int` | 0=ball, 1=player |
| `$f` | **canBeStored** | `bool` | Can save stadium |
| `Df` | **kickOffReset** | `bool` | Full reset on kickoff |
| `Kd` | **playerPhysics** | `Sb` | Player physics config |
| `L` | **vertices** | `G[]` | Vertex array |
| `X` | **segments** | `I[]` | Segment array |
| `sa` | **planes** | `S[]` | Plane array |
| `wc` | **goals** | `lb[]` | Goal array |
| `H` | **discs** | `ya[]` | Disc definitions |
| `rb` | **joints** | `Ab[]` | Joint array |
| `Md` | **redSpawnPoints** | `P[]` | Red spawn positions |
| `vd` | **blueSpawnPoints** | `P[]` | Blue spawn positions |
| `Mh` | **defaultId** | `int` | 255=custom, else built-in index |

## Renderer (class `T`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `oa` | **canvas** | `HTMLCanvas` | The game canvas element |
| `c` | **ctx** | `CanvasRenderingContext2D` | Canvas context |
| `Ya` | **camera** | `P` | Camera position (world coords) |
| `Ig` | **baseZoom** | `float` | Base zoom level (1.5) |
| `Ld` | **fixedHeight** | `float` | Fixed viewport height (0=dynamic) |
| `ue` | **resScale** | `float` | Resolution scale |
| `Wg` | **topBarHeight** | `float` | Top bar height (35) |
| `Ch` | **botBarHeight** | `float` | Bottom bar height (100) |
| `Cd` | **overlays** | `xc` | Goal/victory overlay animations |
| `nd` | **playerRenderers** | `Map` | Player ID → Hb (player renderer) |
| `Ug` | **discRenderers** | `Map` | Disc → Hb mapping |
| `Hp` | **lowLatency** | `bool` | Low-latency canvas |

### Render Transform (in `Rc` method)
```
ctx.translate(canvas.width/2, (canvas.height + topBar - botBar) / 2)
ctx.scale(zoom, zoom)
ctx.translate(-camera.x, -camera.y)
// Everything after this is in WORLD coordinates
// ...rendering...
ctx.resetTransform()  // Back to screen coords for HUD
```

### Zoom Calculation
```javascript
zoom = (fixedHeight !== 0) ? canvas.height / fixedHeight : baseZoom * devicePixelRatio * resScale;
if (maxViewWidth > 0 && canvas.width / zoom > maxViewWidth) zoom = canvas.width / maxViewWidth;
```

## Controller (class `Da`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `za` | **room** | `Ia/Zb` | Room connection (client or host) |
| `l` | **gameView** | `za` | Game view (UI) |
| `W` | **inputCtrl** | `bc` | Input controller |
| `Th` | **chatHandler** | `Wb` | Chat command handler |
| `dg` | **commandHandler** | `ec` | Slash command handler |
| `Nd` | **recorder** | `Ac` | Replay recorder |
| `Re` | **rafId** | `int` | requestAnimationFrame ID |
| `sf` | — | method | Render loop (called every frame) |
| `Rc` | — | method | Calls renderer update |

## GameView (class `za`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `jb` | **stateView** | `hb` | Game state view (scoreboard + renderer) |
| `Ka` | **chatbox** | `Xa` | Chat box |
| `Xa` | **roomView** | `ib` | Room management view |
| `Jf` | **statsView** | `Fb` | FPS/ping stats |
| `od` | **menuOpen** | `bool` | Room menu visible |
| `f` | **element** | `HTMLElement` | Root DOM element |

## GameStateView (class `hb`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `hb` | **renderer** | `T` | Canvas renderer |
| `Wc` | **timer** | `ic` | Timer display |
| `Tb` | **redScore** | `Ob` | Red score display |
| `Ob` | **blueScore** | `Ob` | Blue score display |
| `Rb` | **myPlayerId** | `int` | Local player ID |

## Renderer Access Chain
```
Da.l          → za (GameView)
  .jb         → hb (GameStateView)
    .hb       → T  (Renderer)
      .oa     → canvas element
      .c      → CanvasRenderingContext2D
      .Ya     → P (camera position)
```

## Input Controller (class `bc`)

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `Qc` | **pressed** | `Set<string>` | Currently pressed action names |
| `ng` | **lastInput** | `int` | Last sent input bitmask |
| `Bg` | **onInputChange** | `fn(Ja)` | Callback when input changes |
| `A` | — | method | Reads `pressed` set, builds bitmask, sends if changed |
| `Fa` | — | method | Handles keydown |
| `ld` | — | method | Handles keyup |

### Input Bitmask
```
bit 0 (1)  = Up
bit 1 (2)  = Down
bit 2 (4)  = Left
bit 3 (8)  = Right
bit 4 (16) = Kick
```

## Room Connections

| Min | Real | Parent | Description |
|-----|------|--------|-------------|
| `oa` | **RoomBase** | `W` | Base: game loop, state sync, extrapolation |
| `Ia` | **ClientRoom** | `oa` | Client connection to a host |
| `Zb` | **HostRoom** | `oa` | Host: manages WebSocket, WebRTC peers |
| `$b` | **ReplayRoom** | `oa` | Replay playback |

### Room Properties

| Min | Real | Type | Description |
|-----|------|------|-------------|
| `T` | **gameState** | `va` | Current game state |
| `Y` | **frame** | `int` | Current frame number |
| `yc` | **myPlayerId** | `int` | Our player ID |
| `ta` | — | method | Send action to room |

## Network

| Min | Real | Description |
|-----|------|-------------|
| `qb` | **WebSocketManager** | WS to p2p.haxball.com, signaling |
| `Ca` | **RTCPeer** | WebRTC peer connection setup |
| `Pb` | **Connection** | Active WebRTC connection (data channels) |
| `dc` | **RTCClient** | Client-side RTC handshake |

## Protocol Messages (class `p` subclasses)

| ID | Min | Real Name | Key Fields |
|----|-----|-----------|------------|
| 0 | `Ra` | SetRecaptcha | `kh:bool` |
| 1 | `Jb` | Announcement | `$c:msg`, `color`, `style`, `Ln:sound` |
| 2 | `eb` | AutoBalance | (none) |
| 3 | `Aa` | SetLimits | `Gj:type(0=score,1=time)`, `newValue` |
| 4 | `Qa` | SetAdmin | `Vd:playerId`, `jh:admin` |
| 5 | `Ma` | SetAvatar | `ac:avatar` |
| 6 | `fa` | SetTeam | `Vd:playerId`, `Bj:team` |
| 7 | `Oa` | SetStadium | `Yd:stadium` (deflated) |
| 8 | `Za` | SetTeamColors | `fa:team`, `eh:colors` |
| 9 | `Pa` | SetTeamsLock | `newValue:bool` |
| 10 | `Ha` | PlayerJoin | `Z:id`, `name`, `tj:country`, `Zb:avatar` |
| 11 | `Lb` | SetHostAvatar | `ac:avatar`, `Ke:playerId` |
| 12 | `db` | PauseGame | `Pf:paused` |
| 13 | `ab` | ChatMessage | `$c:message` (max 140 chars) |
| 14 | `Ja` | PlayerInput | `input:bitmask` |
| 15 | `Na` | PlayerActivity | `Hj:type` |
| 16 | `na` | KickPlayer | `Z:playerId`, `qd:reason`, `ah:ban` |
| 17 | `Kb` | ReorderPlayers | `lh:idList`, `Bn:moveToTop` |
| 18 | `Mb` | SetDiscProps | `Ke:discId`, `tn:isPlayer`, `Na:floats[10]`, `Yc:ints[3]` |
| 19 | `La` | SetKickRate | `min`, `rate`, `rj:burst` |
| 20 | `bb` | StartGame | (none) |
| 21 | `cb` | StopGame | (none) |
| 22 | `Ga` | SyncPings | `Ie:pingList` |

## Collision Flags

| Flag | Value | Bit |
|------|-------|-----|
| `ball` | 1 | 0 |
| `red` | 2 | 1 |
| `blue` | 4 | 2 |
| `redKO` | 8 | 3 |
| `blueKO` | 16 | 4 |
| `wall` | 32 | 5 |
| `all` | 63 | 0-5 |
| `kick` | 64 | 6 |
| `score` | 128 | 7 |

## UI Classes

| Min | Real | Description |
|-----|------|-------------|
| `x` | **DOM** | Static DOM helpers (Ia=create, Ba=queryHooks, replaceWith, Qf=clear) |
| `xb` | **NicknameView** | Choose nickname screen |
| `Ya` | **RoomListView** | Room list browser |
| `pb` | **CreateRoomView** | Create room dialog |
| `rb` | **PasswordView** | Room password prompt |
| `ib` | **RoomManageView** | Room controls (start/stop/teams/stadium) |
| `Xa` | **ChatBox** | Chat input/log |
| `ma` | **SettingsView** | Settings dialog |
| `Ua` | **DisconnectedView** | Disconnect reason dialog |
| `mb` | **StadiumPicker** | Stadium selection dialog |
| `vb` | **LocationPicker** | Geo location override |
| `Fa` | **ReplayControls** | Replay playback controls |
| `Eb` | **PlayerInfoDialog** | Player info/kick dialog |
| `ub` | **KickDialog** | Kick/ban dialog |
| `kb` | **LeaveDialog** | Leave room confirmation |
| `Bb` | **RoomLinkView** | Room link copy dialog |
| `Ba` | **PlayerList** | Team player list |
| `wb` | **PlayerListItem** | Single player in list |
| `Fb` | **StatsView** | FPS/ping display |
| `hb` | **GameStateView** | Scoreboard + canvas container |
| `Db` | **RoomListRow** | Single room in list |
| `ca` | **SimpleDialog** | Generic dialog (title, content, buttons) |
| `yb` | **ConnectingView** | "Connecting..." screen |
| `zb` | **UnsupportedView** | Browser not supported screen |

## Utility Classes

| Min | Real | Description |
|-----|------|-------------|
| `J` | **BinaryReader** | Read binary data (DataView wrapper) |
| `A` | **BinaryWriter** | Write binary data |
| `V` | **Crypto** | ECDSA key pair for auth |
| `ha` | **StringUtil** | String truncation, hex conversion |
| `lc` | **Settings** | All localStorage-backed settings |
| `ra` | **Setting** | Single setting with serialization |
| `m` | **Global** | Global config (WS URL, ICE servers, settings instance) |
| `Cc` | **URLParams** | URL query string parser |
| `B` | **AppController** | Static app flow (nickname → room list → join/create) |
| `C` | **ViewManager** | View switching |
| `O` | **ArrayUtil** | Array/string helpers |
| `Y` | **FormatUtil** | Number/string formatting |
| `Q` | **ParseUtil** | parseInt wrapper |
| `Bc` | **LocalStorage** | Safe localStorage access |
| `Ec` | **PromiseTimeout** | Promise with timeout |
| `nb` | **PerfectScrollbar** | Scrollbar wrapper |
| `w` | **Reflect** | Type reflection, toString, enum handling |

## Audio

| Min | Real | Description |
|-----|------|-------------|
| `jc` | **AudioManager** | AudioContext, sound loading, volume |
| `kc` | **CrowdSound** | Dynamic crowd noise |

## Other

| Min | Real | Description |
|-----|------|-------------|
| `ec` | **SlashCommands** | Chat command handler (/avatar, /colors, etc.) |
| `Wb` | **ChatEventHandler** | Handles chat events, @mentions |
| `Vb` | **Autocomplete** | Chat autocomplete for @player and #id |
| `da` | **BigText** | Large animated text (goal/victory announcements) |
| `xc` | **OverlayManager** | Manages big text overlays |
| `Hb` | **PlayerRenderer** | Per-player rendering state (name, avatar, indicator) |
| `ic` | **TimerDisplay** | Match timer display |
| `Ob` | **ScoreDisplay** | Score number display |
| `Ac` | **ReplayRecorder** | Records game for .hbr2 replay |
| `vc` | **ReplayController** | Replay playback controller |
| `Tb` | **SplineCurve** | Cubic spline evaluator (for animations) |
| `fb` | **ActionQueue** | Sorted action queue for game sync |
| `gc` | **RollingAverage** | Sliding window average (for ping/fps) |
| `jb` | **RateLimiter** | Rate limiter for chat/actions |
| `uc` | **Hasher** | Simple hash function |
| `pc` | **PeerState** | Per-peer state (ping tracking) |
| `qc` | **Counter** | Tick counter |
| `Qb` | **RoomListParser** | Parses binary room list from /rs/api/list |
| `Rb` | **RoomInfo** | Room list entry (name, geo, players) |
| `Db` | **RoomRow** | Room list table row |
| `ob` | **StadiumDB** | IndexedDB storage for custom stadiums |
| `Z` | **HTTP** | XHR helpers (GET, POST, JSON) |
| `Ub` | **FileUtil** | File download helpers |
| `sa` | **KeyBindings** | Key binding map |
| `Ea` | **Countries** | Country list with geo coordinates |
| `la` | **GeoLocation** | Geo location (code, lat, lon) |
| `Ta` | **Inflater** | pako inflate wrapper |
| `Ka` | **Cloneable** | Interface marker for clonable objects |
| `fc` | **Serializable** | Interface marker |
| `Dc` | **Connectable** | Interface marker |
| `wc` | **ChannelConfig** | WebRTC channel definitions |
| `Lc` | **ICEParser** | Parse ICE candidates |
| `v` | **HaxError** | Base error class |
| `Nb` | **ValueError** | Error with a value |
| `Sa` | **StadiumError** | Stadium parsing error |
| `ac` | **VersionError** | Version mismatch error |
