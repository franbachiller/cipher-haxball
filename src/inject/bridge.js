// =============================================================
// CipherBot v4 — INSIDE the game IIFE
//
// Physics ported from HaxballGym's bit-exact Rust engine.
// Kick mechanic: ball is pushed AWAY from player center.
// To send ball to target, stand on opposite side of ball.
//
// Design: react first, think second. Never freeze.
// F9 = toggle AI
// =============================================================
(function(){

// ========================= MATH =========================
const V = {
  mk:(x,y)=>({x,y}),
  add:(a,b)=>({x:a.x+b.x,y:a.y+b.y}),
  sub:(a,b)=>({x:a.x-b.x,y:a.y-b.y}),
  sc:(v,s)=>({x:v.x*s,y:v.y*s}),
  dot:(a,b)=>a.x*b.x+a.y*b.y,
  cross:(a,b)=>a.x*b.y-a.y*b.x,
  len:v=>Math.sqrt(v.x*v.x+v.y*v.y),
  dist:(a,b)=>V.len(V.sub(b,a)),
  norm:v=>{const l=V.len(v);return l<1e-9?V.mk(0,0):V.sc(v,1/l);},
  lerp:(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t}),
  rot90:v=>({x:-v.y,y:v.x}),
};
const clamp=(v,lo,hi)=>v<lo?lo:v>hi?hi:v;

// ============= EXACT PHYSICS (from HaxballGym Rust port) =============
// disc-disc collision — bit-exact with game-min.js
function discDisc(pa,pb,va,vb,ra,rb,ima,imb,ba,bb){
  const dx=pa.x-pb.x, dy=pa.y-pb.y;
  const dsq=dx*dx+dy*dy, rs=ra+rb;
  if(dsq<=0||dsq>rs*rs) return null;
  const d=Math.sqrt(dsq);
  const nx=dx/d, ny=dy/d;
  const mf=ima/(ima+imb);
  const overlap=rs-d;
  const pf=overlap*mf;
  pa={x:pa.x+nx*pf, y:pa.y+ny*pf};
  const ob=overlap-pf;
  pb={x:pb.x-nx*ob, y:pb.y-ny*ob};
  let nv=nx*(va.x-vb.x)+ny*(va.y-vb.y);
  if(nv<0){
    nv*=ba*bb+1;
    const ca=mf*nv;
    va={x:va.x-nx*ca, y:va.y-ny*ca};
    const cb=nv-ca;
    vb={x:vb.x+nx*cb, y:vb.y+ny*cb};
  }
  return {pa,pb,va,vb};
}

// Ball sim with wall bounces (planes). Uses exact damping 0.99
function simBall(b,ticks,fw,fh){
  const R=b.radius||10, D=0.99;
  const mx=fw-R, my=fh-R;
  let x=b.x,y=b.y,vx=b.vx,vy=b.vy;
  const pts=[{x,y,vx,vy,t:0}];
  for(let t=1;t<=ticks;t++){
    x+=vx;y+=vy;vx*=D;vy*=D;
    // top/bottom walls — bounce coeff 0.5
    if(y<-my){y=-my;vy=Math.abs(vy)*0.5;}
    if(y>my){y=my;vy=-Math.abs(vy)*0.5;}
    // side walls (but not goal mouth |y|<80)
    if(Math.abs(y)>80){
      if(x<-mx){x=-mx;vx=Math.abs(vx)*0.5;}
      if(x>mx){x=mx;vx=-Math.abs(vx)*0.5;}
    }
    pts.push({x,y,vx,vy,t});
  }
  return pts;
}

// Earliest tick where player can reach ball position
function intercept(pos,speed,path){
  for(const p of path){
    if(V.dist(pos,p)/speed<=p.t+1) return p;
  }
  return path[path.length-1];
}

// Ball approach speed toward a point (positive = coming toward)
function approach(ball,pt){
  const d=V.dist(ball,pt);
  if(d<1) return 0;
  const dir=V.sc(V.sub(pt,ball),1/d);
  return ball.vx*dir.x+ball.vy*dir.y;
}

// ====================== FIELD ======================
function getGoal(goals,team){
  for(const g of goals){
    if(g.team===team){
      const top=g.p0.y<g.p1.y?g.p0:g.p1;
      const bot=g.p0.y<g.p1.y?g.p1:g.p0;
      return{c:V.mk((g.p0.x+g.p1.x)/2,(g.p0.y+g.p1.y)/2),top,bot,
             w:Math.abs(g.p1.y-g.p0.y),x:(g.p0.x+g.p1.x)/2};
    }
  }
  const x=team===1?-560:560;
  return{c:V.mk(x,0),top:V.mk(x,-80),bot:V.mk(x,80),w:160,x};
}
function fd(st){return st?{w:st.w||420,h:st.h||200}:{w:420,h:200};}

// Where to stand so kick sends ball toward target
// (opposite side of ball from target, at `offset` distance)
function kickPos(ball,target,offset){
  const dir=V.norm(V.sub(ball,target));
  return V.add(ball,V.sc(dir,offset));
}

// ====================== EVALUATION ======================
// Best open spot in goal to aim at
function bestSpot(ball,goal,opps){
  let best=goal.c, bestS=-1;
  for(let t=0.1;t<=0.9;t+=0.1){
    const pt=V.lerp(goal.top,goal.bot,t);
    const dir=V.norm(V.sub(pt,ball));
    const d=V.dist(ball,pt);
    let ok=1;
    for(const o of opps){
      const to=V.sub(o.pos,ball);
      const pr=V.dot(to,dir);
      if(pr>0&&pr<d){
        const perp=Math.abs(V.cross(to,dir));
        if(perp<22) ok=0;
        else if(perp<40) ok*=0.5;
      }
    }
    const s=ok*(1-Math.abs(t-0.5)*0.4);
    if(s>bestS){bestS=s;best=pt;}
  }
  return best;
}

// ====================== ROLES ======================
const R={CHASE:0,ATTACK:1,DEFEND:2,GOALIE:3};
function role(me,mates,ball,defG,fw){
  const all=[me,...mates], n=all.length;
  const side=defG.x<0?-1:1;
  const prog=clamp((ball.x*side+fw)/(2*fw),0,1);
  const sd=all.map(p=>({p,d:V.dist(p.pos,ball)})).sort((a,b)=>a.d-b.d);
  const rank=sd.findIndex(s=>s.p.id===me.id);
  if(n===1) return R.CHASE;
  if(n===2) return rank===0?R.CHASE:(prog<0.4?R.DEFEND:R.ATTACK);
  if(n===3){
    if(rank===0) return R.CHASE;
    if(rank===1) return R.ATTACK;
    return prog<0.5?R.DEFEND:R.ATTACK;
  }
  if(rank===0) return R.CHASE;
  if(rank===n-1) return R.GOALIE;
  if(rank===1) return R.ATTACK;
  return prog<0.45?R.DEFEND:R.ATTACK;
}

// ====================== BEHAVIORS ======================
const K=16;
function dir(from,to,dz){
  let m=0;
  const dx=to.x-from.x,dy=to.y-from.y;
  if(dy<-dz)m|=1;if(dy>dz)m|=2;
  if(dx<-dz)m|=4;if(dx>dz)m|=8;
  return m;
}

// ---- CHASE: go for ball, shoot/pass/dribble ----
function doChase(me,ball,bPath,atkG,mates,opps,f){
  const TOUCH=25; // player_r(15) + ball_r(10)
  const db=V.dist(me.pos,ball);

  // Current kick direction if we kicked now
  const kickDir=V.norm(V.sub(ball,me.pos));
  const goalDir=V.norm(V.sub(atkG.c,ball));
  const align=V.dot(kickDir,goalDir);

  // === CONTACT: ball within reach ===
  if(db<TOUCH+4){
    // Good alignment to goal? SHOOT
    if(align>0.5){
      return dir(me.pos,ball,1)|K;
    }
    // Check pass opportunities — can we accidentally pass well?
    for(const m of mates){
      const passDir=V.norm(V.sub(m.pos,ball));
      if(V.dot(kickDir,passDir)>0.7 && V.dist(ball,m.pos)>50){
        return dir(me.pos,ball,1)|K;
      }
    }
    // Alignment OK-ish? Just push it forward (dribble)
    if(align>0.1){
      return dir(me.pos,ball,1);
    }
    // Wrong side — arc around ball
    const perp=V.rot90(goalDir);
    const side=V.dot(V.sub(me.pos,ball),perp)>0?1:-1;
    return dir(me.pos,V.add(ball,V.sc(perp,side*(TOUCH+8))),2);
  }

  // === CLOSE (<90): approach for a shot if ball is slow ===
  if(db<90){
    const bSpeed=V.len(V.mk(ball.vx,ball.vy));
    if(bSpeed<2.5){
      // Ball slow enough to set up — go to kick position
      const spot=bestSpot(ball,atkG,opps);
      const kp=kickPos(ball,spot,TOUCH-3);
      const dkp=V.dist(me.pos,kp);
      if(dkp<40) return dir(me.pos,kp,2);
    }
    // Otherwise just go to ball
    return dir(me.pos,ball,2);
  }

  // === BALL INCOMING: coming at us fast ===
  const inc=approach(ball,me.pos);
  if(inc>2 && db<200){
    // Prepare to redirect toward goal on first touch
    if(db<TOUCH+8){
      // Almost here — kick if alignment decent
      if(align>0.3) return dir(me.pos,ball,1)|K;
      return dir(me.pos,ball,1);
    }
    // Wait for it, but move toward the intercept line
    const kp=kickPos(ball,atkG.c,TOUCH-3);
    const dkp=V.dist(me.pos,kp);
    if(dkp<50) return dir(me.pos,kp,2);
    return dir(me.pos,ball,3);
  }

  // === FAR: intercept trajectory ===
  const ic=intercept(me.pos,5.5,bPath);
  return dir(me.pos,ic,3);
}

// ---- ATTACK: support, find space ----
function doAttack(me,ball,atkG,defG,mates,opps,f){
  const db=V.dist(me.pos,ball);
  // Ball incoming or very close — react
  const inc=approach(ball,me.pos);
  if((inc>2&&db<120)||(db<40)){
    return dir(me.pos,ball,2)|(db<28?K:0);
  }
  // Position: ahead of ball toward goal, offset from teammates
  const btg=V.sub(atkG.c,ball);
  const prog=V.add(ball,V.sc(V.norm(btg),V.len(btg)*0.35));
  let bestY=prog.y, bestS=-Infinity;
  for(let yo=-150;yo<=150;yo+=25){
    const ty=clamp(prog.y+yo,-f.h+25,f.h-25);
    const tp=V.mk(clamp(prog.x,-f.w+30,f.w-30),ty);
    let minM=999;
    for(const m of mates) minM=Math.min(minM,V.dist(m.pos,tp));
    let minO=999;
    for(const o of opps) minO=Math.min(minO,V.dist(o.pos,tp));
    const s=minM*0.5+minO*0.3-V.dist(ball,tp)*0.08;
    if(s>bestS){bestS=s;bestY=ty;}
  }
  return dir(me.pos,V.mk(clamp(prog.x,-f.w+30,f.w-30),bestY),5);
}

// ---- DEFEND ----
function doDefend(me,ball,defG,mates,opps,f){
  const db=V.dist(me.pos,ball);
  // Close or incoming — engage immediately
  const inc=approach(ball,me.pos);
  if(db<65||(inc>1.5&&db<140)){
    return dir(me.pos,ball,2)|(db<28?K:0);
  }
  // Position between ball and goal
  const b2g=V.sub(defG.c,ball);
  const d=V.len(b2g);
  const ratio=clamp(100/Math.max(d,1),0.2,0.5);
  const base=V.add(ball,V.sc(V.norm(b2g),d*ratio));
  const defenders=mates.filter(m=>V.dist(m.pos,defG.c)<V.dist(me.pos,defG.c)+50);
  const idx=defenders.length;
  const yOff=((idx%2===0)?1:-1)*(25+idx*18);
  const target=V.mk(
    clamp(base.x,-f.w+15,f.w-15),
    clamp(base.y+yOff,-f.h+20,f.h-20));
  return dir(me.pos,target,4);
}

// ---- GOALIE ----
function doGoalie(me,ball,bPath,defG,f){
  const gx=defG.x, side=gx<0?-1:1, halfW=defG.w/2;
  const db=V.dist(me.pos,ball);
  // Ball dangerously close to goal — rush out
  if(V.dist(ball,defG.c)<130 && Math.abs(ball.x-gx)<110){
    if(db<28) return dir(me.pos,ball,1)|K;
    return dir(me.pos,ball,2);
  }
  // Ball incoming fast — react
  const inc=approach(ball,me.pos);
  if(inc>3&&db<90){
    return dir(me.pos,ball,2)|(db<28?K:0);
  }
  // Track ball Y on goal line
  let threatY=ball.y;
  for(const p of bPath){
    if((side<0&&p.x<gx+60)||(side>0&&p.x>gx-60)){threatY=p.y;break;}
  }
  const ty=clamp(threatY,-halfW+8,halfW-8);
  return dir(me.pos,V.mk(gx+side*20,ty),3);
}

// ====================== THINK ======================
function think(state){
  if(!state||!state.game||state.game.state!==1||state.game.paused) return 0;
  const me=state.players.find(p=>p.id===state.myId);
  if(!me||!me.pos||me.team===0) return 0;
  const ball=state.game.ball;
  if(!ball) return 0;
  const myT=me.team, opT=myT===1?2:1;
  const atkG=getGoal(state.goals,opT);
  const defG=getGoal(state.goals,myT);
  const f=fd(state.stadium);
  const mates=state.players.filter(p=>p.team===myT&&p.pos&&p.id!==me.id);
  const opps=state.players.filter(p=>p.team===opT&&p.pos);
  const bPath=simBall(ball,90,f.w,f.h);
  const r=role(me,mates,ball,defG,f.w);
  switch(r){
    case R.CHASE:  return doChase(me,ball,bPath,atkG,mates,opps,f);
    case R.ATTACK: return doAttack(me,ball,atkG,defG,mates,opps,f);
    case R.DEFEND: return doDefend(me,ball,defG,mates,opps,f);
    case R.GOALIE: return doGoalie(me,ball,bPath,defG,f);
  }
  return 0;
}

// ====================== STATE READER ======================
function readState(room){
  if(!room) return null;
  const gs=room.T; if(!gs) return null;
  const match=gs.M, stad=gs.U;
  const players=[];
  for(const p of gs.K){
    const d=p.I;
    players.push({id:p.Z,name:p.D,team:p.fa?p.fa.ba:0,
      pos:d?{x:d.a.x,y:d.a.y}:null,
      vel:d?{x:d.G.x,y:d.G.y}:null,radius:d?d.V:0});
  }
  const r={myId:room.yc,players,game:null,goals:[],stadium:null};
  if(stad) r.stadium={w:stad.bc,h:stad.tc};
  if(match){
    const bd=match.va.H[0];
    r.game={state:match.Cb,scoreRed:match.Tb,scoreBlue:match.Ob,
      time:match.Nc,paused:match.Ta===120,
      ball:bd?{x:bd.a.x,y:bd.a.y,vx:bd.G.x,vy:bd.G.y,radius:bd.V}:null};
  }
  if(stad&&stad.wc){
    for(const g of stad.wc)
      r.goals.push({p0:{x:g.$.x,y:g.$.y},p1:{x:g.ea.x,y:g.ea.y},
        team:g.Be?g.Be.ba:0});
  }
  return r;
}

// ====================== AIM ASSIST ======================
// Draws a trajectory line showing where the ball will go if kicked now.
// Uses exact kick physics: kick impulse = normalize(ball-player) * kickStrength * ball.invMass
// Then simulates the trajectory with wall bounces.
// Drawn directly on the game canvas in world coordinates (hooking the renderer).

function simKickTrajectory(ball, playerPos, fw, fh, ticks) {
  const KICK_STRENGTH = 5;  // game default
  const BALL_INV_MASS = 1;  // ball invMass in classic
  const BALL_R = ball.radius || 10;
  const D = 0.99; // ball damping

  // Kick direction = normalize(ball - player)
  const dx = ball.x - playerPos.x, dy = ball.y - playerPos.y;
  const d = Math.sqrt(dx*dx + dy*dy);
  if (d < 1e-6) return [];
  const nx = dx/d, ny = dy/d;

  // Apply kick impulse to ball velocity
  let vx = ball.vx + nx * KICK_STRENGTH * BALL_INV_MASS;
  let vy = ball.vy + ny * KICK_STRENGTH * BALL_INV_MASS;
  let x = ball.x, y = ball.y;

  const mx = fw - BALL_R, my = fh - BALL_R;
  const pts = [{x, y}];

  for (let t = 0; t < ticks; t++) {
    x += vx; y += vy; vx *= D; vy *= D;
    if (y < -my) { y = -my; vy = Math.abs(vy) * 0.5; }
    if (y > my)  { y = my;  vy = -Math.abs(vy) * 0.5; }
    if (Math.abs(y) > 80) {
      if (x < -mx) { x = -mx; vx = Math.abs(vx) * 0.5; }
      if (x > mx)  { x = mx;  vx = -Math.abs(vx) * 0.5; }
    }
    pts.push({x, y});
  }
  return pts;
}

// Check if trajectory passes through a goal
function trajectoryHitsGoal(pts, goals, oppTeam) {
  for (const g of goals) {
    if (g.team !== oppTeam) continue;
    const gx = (g.p0.x + g.p1.x) / 2;
    const gy0 = Math.min(g.p0.y, g.p1.y);
    const gy1 = Math.max(g.p0.y, g.p1.y);
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i-1], p1 = pts[i];
      // Check if segment crosses goal x
      if ((p0.x - gx) * (p1.x - gx) <= 0) {
        const t = (gx - p0.x) / (p1.x - p0.x + 1e-12);
        const cy = p0.y + t * (p1.y - p0.y);
        if (cy >= gy0 && cy <= gy1) return true;
      }
    }
  }
  return false;
}

// Check if trajectory reaches a teammate
function trajectoryReachesMate(pts, mates, myId) {
  for (const m of mates) {
    if (!m.pos || m.id === myId) continue;
    for (const p of pts) {
      if (V.dist(p, m.pos) < m.radius + 12) return m;
    }
  }
  return null;
}

// Draw the aim line on the canvas context (already in world coords)
function drawAimLine(ctx, pts, color, alpha) {
  if (pts.length < 2) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i].x, pts[i].y);
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

// Draw a small target circle
function drawTarget(ctx, pos, color) {
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 8, 0, 2 * Math.PI);
  ctx.stroke();
  // Crosshair
  ctx.beginPath();
  ctx.moveTo(pos.x - 12, pos.y); ctx.lineTo(pos.x + 12, pos.y);
  ctx.moveTo(pos.x, pos.y - 12); ctx.lineTo(pos.x, pos.y + 12);
  ctx.stroke();
  ctx.restore();
}

// Hook T.Rc: after the original render completes, re-apply the world
// transform and draw the aim line. We know the exact transform from
// the renderer's own properties (see SYMBOL_MAP.md).
const _origRc = T.prototype.Rc;
T.prototype.Rc = function(a, b) {
  const result = _origRc.call(this, a, b);
  if (!hax.aimAssist || !hax.room) return result;
  try { renderAimLine(this, a); } catch(e) { console.error('[Cipher] aim err', e); }
  return result;
};

function renderAimLine(renderer, gameState) {
  // gameState = va passed to Rc
  if (!gameState || !gameState.M) return;

  const room = hax.room;
  const myId = room.yc;
  const me = gameState.K.find(p => p.Z === myId);
  if (!me || !me.I || me.fa.ba === 0) return;

  const ball = gameState.M.va.H[0];
  if (!ball) return;

  const mePos = {x: me.I.a.x, y: me.I.a.y};
  const ballPos = {x: ball.a.x, y: ball.a.y};
  const db = V.dist(mePos, ballPos);
  if (db > 120) return;

  const stad = gameState.U;
  const fw = stad ? stad.bc : 420;
  const fh = stad ? stad.tc : 200;

  const ballState = {x: ball.a.x, y: ball.a.y, vx: ball.G.x, vy: ball.G.y, radius: ball.V};
  const traj = simKickTrajectory(ballState, mePos, fw, fh, 60);
  if (traj.length < 2) return;

  const myTeam = me.fa.ba;
  const oppTeam = myTeam === 1 ? 2 : 1;

  const goals = [];
  if (stad && stad.wc) {
    for (const g of stad.wc)
      goals.push({p0:{x:g.$.x,y:g.$.y},p1:{x:g.ea.x,y:g.ea.y},team:g.Be?g.Be.ba:0});
  }
  const mates = gameState.K.filter(p => p.fa && p.fa.ba === myTeam && p.I && p.Z !== myId)
    .map(p => ({id:p.Z,pos:{x:p.I.a.x,y:p.I.a.y},radius:p.I.V}));

  const hitsGoal = trajectoryHitsGoal(traj, goals, oppTeam);
  const hitsMate = trajectoryReachesMate(traj, mates, myId);

  let color = 'rgba(255,255,255,0.5)';
  if (hitsGoal) color = 'rgba(0,255,136,0.8)';
  else if (hitsMate) color = 'rgba(68,170,255,0.8)';

  // Reconstruct the world transform.
  // From T.Rc: translate(W/2, (H+top-bot)/2) → scale(zoom) → translate(-cam)
  const ctx = renderer.c;
  const canvas = renderer.oa;
  const topBar = renderer.Wg * renderer.ue;  // 35 * resScale
  const botBar = renderer.Ch * renderer.ue;  // 100 * resScale
  const cam = renderer.Ya;                   // camera {x,y}

  // Zoom calculation (exact replica of T.Rc)
  let zoom = 0 !== renderer.Ld
    ? canvas.height / renderer.Ld
    : renderer.Ig * window.devicePixelRatio * renderer.ue;
  const maxVW = stad ? stad.mf : 0;
  if (maxVW > 0 && canvas.width / zoom > maxVW) {
    zoom = canvas.width / maxVW;
  }

  ctx.save();
  ctx.resetTransform();
  ctx.translate(canvas.width / 2, (canvas.height + topBar - botBar) / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-cam.x, -cam.y);

  const alpha = clamp(1 - db / 120, 0.3, 0.9);
  drawAimLine(ctx, traj, color, alpha);
  if (hitsGoal) drawTarget(ctx, traj[traj.length - 1], '#00ff88');
  else if (hitsMate) drawTarget(ctx, hitsMate.pos, '#44aaff');

  ctx.restore();
}

// ====================== OP MODE ======================
// Exact gabius/Juze mechanism: for delayed client inputs, write an absolute
// constant frame (default 10) to the wire while retaining the real frame
// locally. Their original source literally does:
//   if (sld) d.tb(sldVar ?? 10); else d.tb(c);
// No input spam, oscillation or extra update loop.
const op={on:false,value:10,hooked:false};
function installOpMode(room){
  if(op.hooked||!room||room.constructor.name!=='Ia') return;
  const proto=Object.getPrototypeOf(room), original=proto.ta;
  if(!original) return;
  proto.ta=function(a){
    if(!(op.on&&a&&a.Td&&a.Td.delay&&this.yd===3))
      return original.call(this,a);
    const seq=this.jq++;
    if(this.dc<0)this.dc=0;
    const realFrame=this.Y+(this.ed|0)+this.dc;
    const out=A.ka();
    out.m(1);
    out.tb(op.value);              // exact original OP Mode modification
    out.tb(seq);
    p.Cj(a,out);
    this.Vb(out);
    if(a.Td.Ca){
      a.Ge=seq;a.P=this.yc;a.gb=realFrame;this.Hg.sn(a);
    }
  };
  op.hooked=true;
}

// ====================== CONTROLLER ======================
const hax={active:false,aimAssist:true,controller:null,room:null};

// ====================== CONTROL PANEL ======================
// The panel lives in an isolated shadow tree so HaxBall styles cannot affect it
// and its styles cannot escape into the game UI. All controls write to the same
// hax/op state used by the existing keyboard shortcuts.
let cipherPanel=null;

function ensureCipherPanelMounted(){
  if(!cipherPanel)return false;
  const mount=document.body||document.documentElement;
  if(!mount)return false;
  const {host}=cipherPanel;
  if(host.parentNode!==mount)mount.appendChild(host);
  return host.isConnected;
}

function syncCipherPanel(){
  if(!cipherPanel)return;
  ensureCipherPanelMounted();
  const {host,aimSwitch,botSwitch,opSwitch,opConfig,opInput}=cipherPanel;
  const syncSwitch=(button,on)=>{
    button.setAttribute('aria-checked',String(on));
    button.dataset.on=String(on);
  };
  syncSwitch(aimSwitch,hax.aimAssist);
  syncSwitch(botSwitch,hax.active);
  syncSwitch(opSwitch,op.on);
  opConfig.dataset.enabled=String(op.on);
  opInput.disabled=!op.on;
  opInput.value=String(op.value);
  host.setAttribute('aria-hidden',String(!cipherPanel.open));
  host.dataset.open=String(cipherPanel.open);
}

function setAimAssist(on){
  hax.aimAssist=!!on;
  syncCipherPanel();
  console.log('%c[Cipher] Aim assist '+(hax.aimAssist?'ON':'OFF'),
    'color:'+(hax.aimAssist?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
}

function setBotActive(on){
  hax.active=!!on;
  syncCipherPanel();
  console.log('%c[Cipher] Bot '+(hax.active?'ON':'OFF'),
    'color:'+(hax.active?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
}

function setOpActive(on){
  op.on=!!on;
  syncCipherPanel();
  console.log('%c[Cipher] OP Mode '+(op.on?'ON':'OFF')+' (value '+op.value+')',
    'color:'+(op.on?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
}

function setCipherPanelOpen(open){
  if(!cipherPanel)return false;
  ensureCipherPanelMounted();
  cipherPanel.open=typeof open==='boolean'?open:!cipherPanel.open;
  if(!cipherPanel.open&&cipherPanel.shadow.activeElement)
    cipherPanel.shadow.activeElement.blur();
  syncCipherPanel();
  return cipherPanel.open;
}

function createCipherPanel(){
  if(cipherPanel||!document.documentElement)return;
  const host=document.createElement('div');
  host.id='cipher-control-panel';
  host.dataset.open='false';
  host.setAttribute('aria-hidden','true');
  const shadow=host.attachShadow({mode:'closed'});
  shadow.innerHTML=`
    <style>
      :host{
        all:initial;
        position:fixed;
        z-index:2147483647;
        top:16px;
        right:16px;
        width:min(322px,calc(100vw - 24px));
        color:#d5d5d5;
        font-family:Inter,"Segoe UI",system-ui,-apple-system,sans-serif;
        font-size:12px;
        line-height:1.35;
        color-scheme:dark;
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        transform:translateY(-6px);
        transition:opacity 140ms ease,transform 140ms ease,visibility 140ms;
      }
      :host([data-open="true"]){
        opacity:1;
        visibility:visible;
        pointer-events:auto;
        transform:translateY(0);
      }
      *,*::before,*::after{box-sizing:border-box}
      button,input{font:inherit}
      .panel{
        position:relative;
        overflow:hidden;
        background:rgba(13,13,14,.91);
        border:1px solid rgba(255,255,255,.09);
        border-radius:7px;
        box-shadow:0 18px 48px rgba(0,0,0,.48),0 2px 8px rgba(0,0,0,.34);
        -webkit-backdrop-filter:blur(9px);
        backdrop-filter:blur(9px);
      }
      .panel::before{
        content:"";
        position:absolute;
        inset:0 auto 0 0;
        width:2px;
        background:#d42020;
        opacity:.9;
      }
      .header{
        display:grid;
        grid-template-columns:1fr auto;
        align-items:start;
        min-height:70px;
        padding:15px 14px 12px 17px;
        border-bottom:1px solid rgba(255,255,255,.065);
      }
      .brand-row{display:flex;align-items:baseline;gap:12px;min-width:0}
      .brand{
        color:#d42020;
        font-size:20px;
        font-weight:200;
        letter-spacing:6px;
        line-height:1;
        text-shadow:0 0 8px rgba(212,32,32,.32),0 0 18px rgba(212,32,32,.14);
      }
      .eyebrow{
        color:#737378;
        font-size:8px;
        font-weight:650;
        letter-spacing:1.8px;
        text-transform:uppercase;
      }
      .subhead{margin-top:8px;color:#66666b;font-size:9px;letter-spacing:.5px}
      .close{
        min-width:35px;
        height:22px;
        padding:0 7px;
        color:#85858a;
        background:#171719;
        border:1px solid #2a2a2d;
        border-radius:3px;
        font-size:8px;
        font-weight:700;
        letter-spacing:1px;
        cursor:pointer;
      }
      .close:hover{color:#d2d2d5;border-color:#454549;background:#1c1c1f}
      .close:active{transform:translateY(1px)}
      button:focus-visible,input:focus-visible{
        outline:2px solid rgba(212,32,32,.9);
        outline-offset:2px;
      }
      .features{padding:3px 14px 3px 17px}
      .feature{
        display:grid;
        grid-template-columns:minmax(0,1fr) auto;
        gap:13px;
        align-items:center;
        padding:13px 0;
        border-bottom:1px solid rgba(255,255,255,.055);
      }
      .feature:last-of-type{border-bottom:0}
      .feature-top{display:flex;align-items:center;gap:7px;margin-bottom:3px}
      .name{color:#d2d2d4;font-size:11px;font-weight:600;letter-spacing:.15px}
      .key{
        min-width:29px;
        padding:2px 4px;
        color:#69696f;
        background:#171719;
        border:1px solid #29292c;
        border-radius:3px;
        font-size:7px;
        font-weight:700;
        letter-spacing:.7px;
        line-height:1.2;
        text-align:center;
      }
      .desc{color:#65656a;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .switch{
        position:relative;
        width:34px;
        height:18px;
        padding:0;
        flex:none;
        background:#202023;
        border:1px solid #343438;
        border-radius:10px;
        cursor:pointer;
        transition:background 120ms ease,border-color 120ms ease;
      }
      .switch::after{
        content:"";
        position:absolute;
        top:3px;
        left:3px;
        width:10px;
        height:10px;
        border-radius:50%;
        background:#77777c;
        box-shadow:0 1px 2px rgba(0,0,0,.55);
        transition:transform 120ms ease,background 120ms ease;
      }
      .switch[data-on="true"]{background:#321415;border-color:#6a2225}
      .switch[data-on="true"]::after{transform:translateX(16px);background:#d42020}
      .switch:hover{border-color:#55555a}
      .op-config{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        margin:0 14px 11px 17px;
        padding:8px 10px;
        background:rgba(255,255,255,.025);
        border:1px solid rgba(255,255,255,.055);
        border-radius:4px;
        transition:opacity 120ms ease;
      }
      .op-config[data-enabled="false"]{opacity:.42}
      .op-label{color:#78787d;font-size:8px;font-weight:650;letter-spacing:1.15px;text-transform:uppercase}
      .value-wrap{display:flex;align-items:center;gap:6px}
      .value-wrap::after{content:"FRAME";color:#55555a;font-size:7px;font-weight:650;letter-spacing:.9px}
      .op-value{
        width:49px;
        height:25px;
        padding:3px 5px;
        color:#d2d2d5;
        background:#111113;
        border:1px solid #303034;
        border-radius:3px;
        text-align:center;
        font-variant-numeric:tabular-nums;
        -moz-appearance:textfield;
      }
      .op-value::-webkit-inner-spin-button{opacity:.35}
      .op-value:disabled{color:#77777b;cursor:not-allowed}
      .footer{
        padding:10px 14px 11px 17px;
        border-top:1px solid rgba(255,255,255,.06);
        color:#56565b;
        font-size:8px;
        letter-spacing:.55px;
      }
      @media(max-width:420px){
        :host{top:8px;right:8px;width:calc(100vw - 16px)}
        .header{min-height:63px;padding-top:13px}
        .feature{padding:11px 0}
      }
      @media(prefers-reduced-motion:reduce){
        :host,.switch,.switch::after,.op-config{transition:none!important}
      }
    </style>
    <section class="panel" aria-label="Cipher controls">
      <header class="header">
        <div>
          <div class="brand-row">
            <span class="brand">cipher</span>
            <span class="eyebrow">Control</span>
          </div>
          <div class="subhead">in-game bridge / input modules</div>
        </div>
        <button class="close" type="button" aria-label="Hide Cipher controls">INS</button>
      </header>
      <div class="features">
        <div class="feature">
          <div>
            <div class="feature-top"><span class="name">Aim Assist</span><span class="key">F8</span></div>
            <div class="desc">Projected kick path and target line</div>
          </div>
          <button class="switch aim-switch" type="button" role="switch" aria-label="Aim Assist" aria-checked="true"></button>
        </div>
        <div class="feature">
          <div>
            <div class="feature-top"><span class="name">AI Bot</span><span class="key">F9</span></div>
            <div class="desc">Autonomous positioning and ball control</div>
          </div>
          <button class="switch bot-switch" type="button" role="switch" aria-label="AI Bot" aria-checked="false"></button>
        </div>
        <div class="feature">
          <div>
            <div class="feature-top"><span class="name">OP Mode</span><span class="key">CTRL</span></div>
            <div class="desc">Absolute delayed input frame override</div>
          </div>
          <button class="switch op-switch" type="button" role="switch" aria-label="OP Mode" aria-checked="false"></button>
        </div>
      </div>
      <label class="op-config" data-enabled="false">
        <span class="op-label">Wire value</span>
        <span class="value-wrap"><input class="op-value" type="number" min="0" max="120" step="1" value="10" aria-label="OP Mode absolute wire frame value"></span>
      </label>
      <footer class="footer">
        <span>Insert to hide</span>
      </footer>
    </section>`;

  const aimSwitch=shadow.querySelector('.aim-switch');
  const botSwitch=shadow.querySelector('.bot-switch');
  const opSwitch=shadow.querySelector('.op-switch');
  const opConfig=shadow.querySelector('.op-config');
  const opInput=shadow.querySelector('.op-value');
  const close=shadow.querySelector('.close');
  cipherPanel={host,shadow,open:false,aimSwitch,botSwitch,opSwitch,opConfig,opInput};

  aimSwitch.addEventListener('click',()=>setAimAssist(!hax.aimAssist));
  botSwitch.addEventListener('click',()=>setBotActive(!hax.active));
  opSwitch.addEventListener('click',()=>setOpActive(!op.on));
  close.addEventListener('click',()=>setCipherPanelOpen(false));
  opInput.addEventListener('change',()=>{
    const parsed=Number(opInput.value);
    op.value=Number.isFinite(parsed)?clamp(Math.trunc(parsed),0,120):10;
    syncCipherPanel();
  });
  opInput.addEventListener('keydown',e=>{
    if(e.code==='Enter')opInput.blur();
  });

  // Keep pointer and typing events inside the panel instead of the game UI.
  for(const type of ['keydown','keyup','keypress','pointerdown','pointerup','mousedown','mouseup','click','dblclick','contextmenu','wheel','touchstart','touchend'])
    shadow.addEventListener(type,e=>e.stopPropagation());

  ensureCipherPanelMounted();
  syncCipherPanel();
}

createCipherPanel();
// The bridge executes before HaxBall completes its final DOM initialization.
// Mount once more after that task so a body replacement cannot strand the
// single Shadow DOM host in a detached tree.
setTimeout(()=>{
  ensureCipherPanelMounted();
  syncCipherPanel();
},0);
const _origSf=Da.prototype.sf;
Da.prototype.sf=function(){
  // Always update — a new Da is created each time you join a room
  if(hax.controller!==this){
    hax.controller=this;hax.room=this.za;
    installOpMode(this.za);
    console.log('%c[Cipher] Controller captured','color:#0f0');
  }
  if(hax.active&&hax.room){
    const s=readState(hax.room);
    const inp=think(s);
    const bc=this.W;
    if(bc){
      bc.Qc.clear();
      if(inp&1)bc.Qc.add('Up');if(inp&2)bc.Qc.add('Down');
      if(inp&4)bc.Qc.add('Left');if(inp&8)bc.Qc.add('Right');
      if(inp&16)bc.Qc.add('Kick');
      bc.A();
    }
  }
  return _origSf.call(this);
};

// ====================== HOTKEYS ======================
function isInsertEvent(e){
  return e.code==='Insert'||e.key==='Insert'||e.keyCode===45||e.which===45;
}

function cipherHotkeyHandler(e){
  const isInsert=isInsertEvent(e);
  const isFeature=e.code==='F8'||e.code==='F9'||e.code==='ControlLeft'||e.code==='ControlRight';
  if(!isInsert&&!isFeature)return;

  // Keyboard input intended for a panel control must not toggle game features.
  const path=typeof e.composedPath==='function'?e.composedPath():[];
  const fromPanel=cipherPanel&&path.includes(cipherPanel.host);
  if(fromPanel&&!isInsert){
    e.stopImmediatePropagation();
    return;
  }

  e.preventDefault();e.stopImmediatePropagation();
  if(e.repeat)return;
  if(isInsert){setCipherPanelOpen();return;}
  if(e.code==='F9'){setBotActive(!hax.active);return;}
  if(e.code==='F8'){setAimAssist(!hax.aimAssist);return;}
  setOpActive(!op.on);
}

// HaxBall keeps the game in an iframe while keyboard focus can remain on
// /play. Listen in every same-origin browsing context without registering the
// handler twice when window, parent and top resolve to the same object.
const hotkeyTargets=[];
function addHotkeyTarget(target){
  if(!target||hotkeyTargets.includes(target))return;
  try{
    target.addEventListener('keydown',cipherHotkeyHandler,true);
    hotkeyTargets.push(target);
  }catch(e){
    // Cross-origin parent/top access is expected to fail safely.
  }
}
addHotkeyTarget(window);
try{addHotkeyTarget(window.parent);}catch(e){}
try{addHotkeyTarget(window.top);}catch(e){}

hax.setOp=function(v){op.value=Math.max(0,v|0);syncCipherPanel();return op.value;};
hax.togglePanel=function(open){return setCipherPanelOpen(open);};
window.__hax__=hax;
console.log('%c[Cipher] v4 loaded — INS: controls | F8: aim assist | F9: bot AI | CTRL: OP Mode','color:#0af;font-size:12px');
})();
