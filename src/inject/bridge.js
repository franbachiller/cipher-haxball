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
// The netcode schedules each input to apply at a future frame. In ClientRoom
// ta(action), for delayed actions (real inputs):
//     c = this.Y + (this.ed|0) + this.dc
// and c is BOTH sent to the host (d.tb(c)) AND stored locally (a.gb = c) for
// your own prediction. The host broadcasts your input tagged with frame c.
//
// Normally c - Y is ~3..5 (your render-extrapolation lead). The community
// anti-opmode detects opmode by exactly this: input messages whose
// (clientFrame - hostFrame) is abnormally LOW (<= 2, often 0 or negative).
//
// So OP Mode = report a LOW/earlier frame to the host while keeping your real
// frame locally:
//   - host + remote clients: input arrives "already applied" (frame ~= now),
//     so they can't extrapolate you ahead — your confirmed position jumps and
//     you read as shaky/unhittable to them.
//   - you: a.gb keeps the real c, so your own prediction stays smooth.
//
// We can't just zero this.dc/ed (ta re-clamps dc>=0 and still adds ed), and a
// lower c must ALSO reach the wire, not only the fields. So we reimplement
// ta for inputs: send c - value to the host, store the real c locally.
// op.value = how many frames earlier to report (bigger = more desync).
const op={on:false,value:50,phase:0,hooked:false,diag:true,_n:0};

function installOpMode(room){
  if(op.hooked) return;
  const proto=Object.getPrototypeOf(room);
  if(!proto||!proto.ta){ console.log('[Cipher] OP: no ta on room proto'); return; }
  // DIAG: report what the room actually is and where ta lives.
  console.log('[Cipher] OP diag: room ctor=%s protoHasTa=%s ownTa=%s',
    room.constructor&&room.constructor.name, typeof proto.ta,
    Object.prototype.hasOwnProperty.call(proto,'ta'));
  const _origTa=proto.ta;
  proto.ta=function(a){
    // DIAG: log EVERY action through ta so we can see if inputs route here.
    if(op.diag){
      if((op._n++ % 20)===0){
        console.log('[Cipher OP diag] ta called: hasTd=%s delay=%s yd=%d Y=%d ed=%d dc=%d on=%s',
          !!(a&&a.Td), a&&a.Td&&a.Td.delay, this.yd, this.Y, this.ed|0, this.dc, op.on);
      }
    }
    // Only touch real gameplay inputs. Chat/admin (delay=false) stay in sync.
    if(!(op.on && a && a.Td && a.Td.delay && 3===this.yd)){
      return _origTa.call(this,a);
    }
    // Reimplement ta() so the frame we REPORT swings hard around the host's
    // target while our LOCAL apply-frame stays correct.
    //
    // The host computes Hn = c - (Y + Od) from our reported frame c and
    // broadcasts it uncapped; remote clients feed Hn into our disc's
    // extrapolation. A small/steady Hn = smooth (what we got before). To make
    // enemies see teleport/shaky, Hn must swing violently: we alternate c far
    // below and far above the target each input, so remote extrapolation
    // projects our disc forward then backward = jitter/teleport. Our own view
    // uses a.gb = cReal, so locally we stay normal per our extrapolation.
    const b=this.jq++;
    if(0>this.dc) this.dc=0;
    const cReal=this.Y+(this.ed|0)+this.dc;      // real apply-frame (local)
    op.phase^=1;
    const swing=op.value;                        // how far to swing (frames)
    const cSend=op.phase ? (this.Y - swing) : (this.Y + swing);
    if((op._m=(op._m||0)+1)%20===0){
      console.log('[Cipher OP ACTIVE] cReal=%d cSend=%d swing=%d phase=%d',
        cReal, cSend, swing, op.phase);
    }
    const d=A.ka();
    d.m(1);
    d.tb(cSend);                                 // <-- swinging frame on wire
    d.tb(b);
    p.Cj(a,d);
    this.Vb(d);
    if(a.Td.Ca){ a.Ge=b; a.P=this.yc; a.gb=cReal; this.Hg.sn(a); } // real local
  };
  op.hooked=true;
  console.log('%c[Cipher] OP Mode hook installed','color:#0f0');
}

// ====================== CONTROLLER ======================
const hax={active:false,aimAssist:true,controller:null,room:null};
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
window.addEventListener('keydown',function(e){
  if(e.code==='F9'){
    e.preventDefault();e.stopPropagation();
    hax.active=!hax.active;
    console.log('%c[Cipher] Bot '+(hax.active?'ON':'OFF'),
      'color:'+(hax.active?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
  }
  if(e.code==='F8'){
    e.preventDefault();e.stopPropagation();
    hax.aimAssist=!hax.aimAssist;
    console.log('%c[Cipher] Aim assist '+(hax.aimAssist?'ON':'OFF'),
      'color:'+(hax.aimAssist?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
  }
  if(e.code==='ControlLeft'||e.code==='ControlRight'){
    e.preventDefault();e.stopPropagation();
    op.on=!op.on;
    console.log('%c[Cipher] OP Mode '+(op.on?'ON':'OFF')+' (value '+op.value+')',
      'color:'+(op.on?'#0f0':'#f44')+';font-size:14px;font-weight:bold');
  }
},true);

// Adjust OP Mode strength from the console: __hax__.setOp(value)
hax.setOp=function(v){op.value=Math.max(0,v|0);console.log('[Cipher] OP Mode value =',op.value);};

window.__hax__=hax;
console.log('%c[Cipher] v4 loaded — F8: aim assist | F9: bot AI | CTRL: OP Mode','color:#0af;font-size:12px');
})();
