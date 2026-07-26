# HaxBall game-min.js — Full Class Map
# Generated from beautified source (10449 lines)
# 149 classes found

## hb (L23-46)
  Fields:
    this.Rb = -1
    this.hb = new T(m.j.ki.v())
    this.Wc = new ic
    this.f = x.Ia(hb.O)
    this.Tb = new Ob(a.get("red-score"), 0)
    this.Ob = new Ob(a.get("blue-score"), 0)
    this.hb = new T(b)
  Methods:
    constructor() @ L24
    A(a) @ L36
    if(this.hb.Hp != b) @ L38
  Statics:
    hb.b = !0 @ L10094
    hb.O = "<div class='game-state-view'><div class='bar-container'><div class='bar'><div c @ L10429
  Template: <div class='game-state-view'><div class='bar-container'><div class='bar'><div cl... @ L10429

## Pb (L47-105)
  Fields:
    this.rd = null
    this.pr = 1E4
    this.Ed = !0
    this.La = a.La
    this.cd = a.cd
    this.Ae = a.Ae
    this.rd = a.rd
    this.Xm = window.performance.now()
    this.Ed = !1, this.La.close(), null != this.tf && this.tf())
  Methods:
    constructor(a) @ L48
    for(; a < d.length;) @ L72
    ps() @ L83
    Vb(a, b) @ L86
    if(this.Ed) @ L87
    if("open" == c.readyState) @ L90
    la() @ L101
  Statics:
    Pb.b = !0 @ L9647

## ib (L106-263)
  Fields:
    this.Bk = !1
    this.Pm = new Ba(u.Pa)
    this.dk = new Ba(u.Da)
    this.hm = new Ba(u.ja)
    this.f = x.Ia(ib.O)
    this.lc = b.get("room-name")
    this.Sm = b.get("start-btn")
    this.Um = b.get("stop-btn")
    this.vi = b.get("pause-btn")
    this.bo = b.get("auto-btn")
    this.hl = b.get("lock-btn")
    this.rm = b.get("reset-all-btn")
    this.fm = b.get("rec-btn")
    this.Lf = b.get("time-limit-sel")
    this.Ef = b.get("score-limit-sel")
    this.Qm = b.get("stadium-name")
    this.Rm = b.get("stadium-pick")
    this.Fr = a.lc, this.lc.textContent = a.lc)
    this.Bk = b)
    this.ii = a
    this.Ll = a
  Methods:
    constructor(a) @ L107
    function() @ L145
    di(a, b, c) @ L178
    nl() @ L195
    for(; 15 > b;) @ L198
    ol(a, b) @ L204
    for(; c < b.length;) @ L206
    ds(a) @ L213
    A(a, b) @ L216
    for(var e = this.hm, f = a.K, g = [], h = 0; h < f.length;) @ L234
    Uj(a) @ L255
    Vj(a) @ L259
  Statics:
    ib.b = !0 @ L10166
    ib.O = "<div class='room-view'><div class='container'><h1 data-hook='room-name'></h1><d @ L10442
  Template: <div class='room-view'><div class='container'><h1 data-hook='room-name'></h1><di... @ L10442

## x (L264-287)
  Methods:
    static Ba(a) @ L265
    static Ia(a, b) @ L274
    static replaceWith(a, b) @ L280
    static Qf(a) @ L283
  Statics:
    x.b = !0 @ L9675

## jc (L288-337)
  Fields:
    this.c = new AudioContext
    this.qg = this.c.createGain()
    this.Zo = Promise.all([b("sounds/chat.wav").then(function(d) {
  Methods:
    constructor(a) @ L289
    sm() @ L322
    md(a) @ L325
    Fi() @ L331
  Statics:
    jc.b = !0 @ L9856

## lc (L338-446)
  Fields:
    this.qe = e("player_name", "", 25)
    this.Rd = d("view_mode", -1)
    this.Qh = d("fps_limit", 0)
    this.zh = e("avatar", null, 2)
    this.Wm = b("team_colors", !0)
    this.Vk = b("show_indicators", !0)
    this.Xi = c("sound_volume", 1)
    this.ye = b("sound_main", !0)
    this.Wi = b("sound_chat", !0)
    this.Om = b("sound_highlight",
    this.Nm = b("sound_crowd", !0)
    this.Zj = e("player_auth_key", null, 1024)
    this.Ad = d("extrapolation", 0)
    this.Li = c("resolution_scale", 1)
    this.Lm = b("show_avatars", !0)
    this.lk = d("chat_height", 160)
    this.Gh = d("chat_focus_height", 140)
    this.Hh = c("chat_opacity", .8)
    this.kk = e("chat_bg_mode", "compact", 50)
    this.ki = b("low_latency_canvas", !0)
    this.af = a("geo_override")
    this.Jd = function() {
  Methods:
    constructor() @ L339
    function(k) @ L381
    function(k) @ L388
    function(g) @ L434
    Vh() @ L443
  Statics:
    lc.b = !0 @ L9826

## Cc (L447-466)
  Methods:
    static xf(a) @ L448
    static v() @ L463
  Statics:
    Cc.b = !0 @ L9804

## nc (L467-469)
  Methods:
    constructor() @ L468
  Statics:
    nc.b = !0 @ L9704

## ha (L470-482)
  Methods:
    static Os(a) @ L475
  Statics:
    ha.b = !0 @ L9576

## Qb (L483-521)
  Methods:
    static parse(a) @ L484
    for(; 0 != a.s.byteLength - a.a;) @ L487
    static Zs(a, b, c, d) @ L501
    static vt(a, b) @ L504
    for(; d < b.length;) @ L508
    static get() @ L516
  Statics:
    Qb.b = !0 @ L9854

## Z (L522-559)
  Methods:
    static pm(a, b, c, d, e) @ L523
    function(k) @ L532
    static v(a, b) @ L539
    static Ok(a) @ L542
    static Xq(a, b, c) @ L549
    static Zl(a, b, c) @ L552
  Statics:
    Z.b = !0 @ L9794
    Z.Mj = "application/x-www-form-urlencoded" @ L10273

## pc (L560-578)
  Fields:
    this.sl = new qc(15)
    this.bi = 0
    this.Qj = new Map
    this.pp = new jb(100, 16)
    this.Lg = !1
    this.zb = 0
    this.ua = ?
    this.Ve = a.Wb()
  Methods:
    constructor(a) @ L561
    Vb(a, b) @ L574
  Statics:
    pc.b = !0 @ L9764

## kb (L579-591)
  Fields:
    this.f = x.Ia(kb.O)
  Methods:
    constructor() @ L580
  Statics:
    kb.b = !0 @ L10114
    kb.O = "<div class='dialog basic-dialog leave-room-view'><h1>Leave room?</h1><p>Are you @ L10432
  Template: <div class='dialog basic-dialog leave-room-view'><h1>Leave room?</h1><p>Are you ... @ L10432

## J (L592-697)
  Fields:
    this.s = a
    this.Ua = b
    this.a = 0
    this.a = b
  Methods:
    constructor(a, b) @ L593
    lb(a) @ L599
    cm(a) @ L606
    zf() @ L613
    F() @ L616
    Ci() @ L619
    Sb() @ L624
    N() @ L629
    kb() @ L634
    Bi() @ L639
    w() @ L644
    Bb() @ L650
    se(a) @ L658
    Ab() @ L666
    kc() @ L670
    em() @ L673
    Jg() @ L676
  Statics:
    J.b = !0 @ L9651

## Sb (L698-741)
  Fields:
    this.ff = 0
    this.V = 15
    this.C = 0
    this.ra = new P(0, 0)
    this.ca = this.o = .5
    this.Ea = .96
    this.Qe = .1
    this.gf = .07
    this.hf = .96
    this.ef = 5
    this.o = a.w()
    this.ca = a.w()
    this.Ea = a.w()
    this.Qe = a.w()
    this.gf = a.w()
    this.hf = a.w()
    this.ef = a.w()
    this.C = a.N()
    this.V = a.w()
    this.ff = a.w()
  Methods:
    constructor() @ L699
    ha(a) @ L711
    na(a) @ L726
  Statics:
    Sb.b = !0 @ L9877

## ta (L742-886)
  Fields:
    this.jc = -1
    this.ic = null
    this.Jl = 0
    this.i = this.C = 63
    this.ek = 0
    this.S = 16777215
    this.Ea = .99
    this.ca = 1
    this.o = .5
    this.V = 10
    this.ra = new P(0, 0)
    this.G = new P(0, 0)
    this.a = new P(0, 0)
    this.V = a.w()
    this.o = a.w()
    this.ca = a.w()
    this.Ea = a.w()
    this.S = a.kb()
    this.i = a.N()
    this.C = a.N()
    this.ic = b = new ta), this.jc = a, ta.zd(b, this))
  Methods:
    constructor() @ L743
    ha(a) @ L758
    na(a) @ L776
    yo(a) @ L794
    if(0 < f && f <= e * e) @ L801
    zo(a) @ L822
    if(0 != 0 * a.vb) @ L823
    vc() @ L857
    static zd(a, b) @ L863
  Statics:
    ta.b = !0 @ L10023
    ta.ad = [Ka] @ L10024

## Tb (L887-908)
  Methods:
    constructor(a) @ L888
    eval(a) @ L891
  Statics:
    Tb.b = !0 @ L9782

## da (L909-971)
  Fields:
    this.kf = c
  Methods:
    constructor(a, b) @ L910
    hp() @ L916
    Rc(a, b) @ L920
    for(; d < e.length;) @ L926
    Er(a) @ L940
    for(; c < d.length;) @ L945
    nc(a) @ L953
    bq(a, b) @ L956
  Statics:
    da.b = !0 @ L10054
    da.Nn = new Tb([0, 0, 2, 1, 0, .35, 1, 0, 1, 0, .7, 1, 0, 0, 0, 1]) @ L10421
    da.On = new Tb([0, -1, 3, 0, 0, .35, 0, 0, 0, 0, .65, 0, 0, 1, 3, 1]) @ L10422

## lb (L972-998)
  Fields:
    this.Be = ?
    this.ea = new P(0, 0)
    this.Be = 1 == a ? u.ja : 2 == a ? u.Da : u.Pa
  Methods:
    constructor() @ L973
    ha(a) @ L979
    na(a) @ L988
  Statics:
    lb.b = !0 @ L9873

## mb (L999-1111)
  Fields:
    this.nb = null
    this.f = x.Ia(mb.O)
    this.wi = a.get("pick")
    this.yk = a.get("delete")
    this.Mk = a.get("export")
    this.bm = nb.mi(c)
  Methods:
    constructor() @ L1000
    if(null != b.nb) @ L1021
    Xg() @ L1056
    ml(a, b, c) @ L1061
    zi(a) @ L1085
    for(; c < b.length;) @ L1088
    for(; f < e.length;) @ L1098
  Statics:
    mb.b = !0 @ L10118
    mb.O = "<div class='dialog pick-stadium-view'><h1>Pick a stadium</h1><div class='splitt @ L10433
  Template: <div class='dialog pick-stadium-view'><h1>Pick a stadium</h1><div class='splitte... @ L10433

## Dc (L1112-0)
  Statics:
    Dc.b = !0 @ L9616
    Dc.wh = !0 @ L9617

## pb (L1113-1165)
  Fields:
    this.f = x.Ia(pb.O)
    this.Eh = b.get("cancel")
    this.sk = b.get("create")
    this.pf = b.get("name")
    this.Kl = b.get("pass")
    this.pi = b.get("max-pl")
    this.en = b.get("unlisted")
    this.fn = a
  Methods:
    constructor(a) @ L1114
    Yj(a) @ L1154
    Ic() @ L1158
    A() @ L1162
  Statics:
    pb.b = !0 @ L10086
    pb.O = "<div class='create-room-view'><div class='dialog'><h1>Create room</h1><div clas @ L10427
  Template: <div class='create-room-view'><div class='dialog'><h1>Create room</h1><div class... @ L10427

## ra (L1166-1185)
  Fields:
    this.D = a
    this.Is = d
    this.li = b
    this.jn = c(d)
    this.jn = a
  Methods:
    constructor(a, b, c, d) @ L1167
    v() @ L1175
    ia(a) @ L1178
  Statics:
    ra.b = !0 @ L9831

## qb (L1186-1515)
  Fields:
    this.Ah = new Set
    this.Yf = new Set
    this.Mg = this.Cf = this.Dm = !1
    this.Tc = null
    this.Ff = this.ba = ""
    this.Lr = 5E4
    this.Kr = 1E4
    this.xd = new Map
    this.ls = a
    this.kg = b
    this.ro = c
    this.Ff = d
    this.Ff = "")
    this.ve = null
    this.aa = null
    this.Tc = a.slice(0)
    this.Mg = !0
    this.ve = window.setTimeout(function() {
    this.Cf = a
    this.qm = window.setTimeout(b, 1E3))
    this.Ol = window.setInterval(function() {
    this.ba = a.se(a.F())
    this.Ff = a.se(a.s.byteLength - a.a)
    this.Mg = !1
    this.Dm = this.Cf
    this.ve = null
    this.Mg = !1
    this.tm = ?
  Methods:
    constructor(a, b, c, d) @ L1187
    la() @ L1203
    Ui(a) @ L1216
    if(null != this.Tc || null != a) @ L1217
    for(; f < g;) @ L1225
    if(c[h] != d[h]) @ L1227
    Ti(a) @ L1243
    Zi(a) @ L1253
    switch(e.action) @ L1283
    Ap() @ L1294
    Zh(a) @ L1318
    zp(a, b, c, d, e, f) @ L1339
    for(var g = [], h = 0; h < d.length;) @ L1343
    if(null != r) @ L1345
    Yh(a) @ L1394
    up(a, b) @ L1406
    if(null != a) @ L1408
    vp(a) @ L1414
    yp(a) @ L1418
    Uc(a, b, c) @ L1421
    if(!b.Hl) @ L1422
    Hf(a, b) @ L1432
    Oi() @ L1439
    Pi() @ L1444
    Cm() @ L1452
    Qi(a, b, c, d) @ L1459
    Ni(a, b) @ L1466
    Lk() @ L1471
    for(; !b.done;) @ L1474
    Wh(a) @ L1481
    fo(a) @ L1494
    de() @ L1504
    static Qk(a) @ L1508
  Statics:
    qb.b = !0 @ L9642

## Ec (L1516-1531)
  Methods:
    static Zm(a, b) @ L1517
  Statics:
    Ec.b = !0 @ L9677

## rc (L1532-1536)
  Methods:
    static h(a, b, c, d) @ L1533
  Statics:
    rc.b = !0 @ L9798

## rb (L1537-1566)
  Fields:
    this.f = x.Ia(rb.O)
    this.Db = a.get("input")
    this.rf = a.get("ok")
  Methods:
    constructor() @ L1538
    Ic() @ L1559
    A() @ L1563
  Statics:
    rb.b = !0 @ L10162
    rb.O = "<div class='room-password-view'><div class='dialog'><h1>Password required</h1>< @ L10441
  Template: <div class='room-password-view'><div class='dialog'><h1>Password required</h1><d... @ L10441

## Ua (L1567-1584)
  Fields:
    this.f = x.Ia(Ua.O)
    this.kq = c.get("ok")
    this.nm = c.get("replay")
  Methods:
    constructor(a, b) @ L1568
  Statics:
    Ua.b = !0 @ L10090
    Ua.O = "<div class='disconnected-view'><div class='dialog basic-dialog'><h1>Disconnecte @ L10428
  Template: <div class='disconnected-view'><div class='dialog basic-dialog'><h1>Disconnected... @ L10428

## O (L1585-1607)
  Methods:
    static sj(a, b) @ L1586
    static substr(a, b, c) @ L1590
    static remove(a, b) @ L1597
    static now() @ L1604
  Statics:
    O.b = !0 @ L9571

## Y (L1608-1635)
  Methods:
    static at(a, b) @ L1609
    static ut(a) @ L1613
    static Of(a) @ L1619
    static replace(a, b, c) @ L1625
    static hh(a, b) @ L1628
  Statics:
    Y.b = !0 @ L9575

## P (L1636-1641)
  Fields:
    this.x = a
    this.y = b
  Methods:
    constructor(a, b) @ L1637
  Statics:
    P.b = !0 @ L9790

## ma (L1642-1859)
  Fields:
    this.f = x.Ia(ma.O)
    this.wd = l.get("close")
  Methods:
    constructor(a) @ L1643
    for(; ea < K.length;) @ L1652
    function() @ L1733
    for(; K < n.length;) @ L1756
    g("tsound-main", m.j.ye, function() @ L1776
    f("viewmode", m.j.Rd, function(y) @ L1782
    f("fps", m.j.Qh, function(y) @ L1787
    f("resscale", m.j.Li, function(y) @ L1793
    f("chatbgmode", m.j.kk, function(y) @ L1819
    function() @ L1833
  Statics:
    ma.b = !0 @ L10170
    ma.O = '<div class=\'dialog settings-view\'><h1>Settings</h1><button data-hook=\'close\ @ L10443
    ma.zm = 0 @ L10444
  Template: <div class=\'dialog settings-view\'><h1>Settings</h1><button data-hook=\'close\'... @ L10443

## aa (L1860-2075)
  Fields:
    this.jc = -1
    this.ic = null
    this.Tb = this.Ob = this.Nc = this.Ta = 0
    this.le = u.ja
    this.zc = ?
    this.Cb = 0
    this.va = new Wa
    this.Ga = 0
    this.mb = 5
    this.U = null
    this.Sa = a
    this.mb = a.mb
    this.Ga = a.Ga
    this.U = a.U
    this.Cb = 1)
    this.Cb = 2, this.zc = 150, this.le = d, d == u.ja ? this.Ob++ : this.
    this.zc = 300
    this.Cb = 3
    this.Cb = 0
    this.zc = a.N()
    this.Cb = a.N()
    this.Tb = a.N()
    this.Ob = a.N()
    this.Nc = a.w()
    this.Ta = a.N()
    this.le = 1 == a ? u.ja : 2 == a ? u.Da : u.Pa
    this.Sa = b
    this.mb = b.mb
    this.Ga = b.Ga
    this.U = b.U
    this.ic = b = new aa), this.jc = a, aa.zd(b, this))
  Methods:
    constructor() @ L1861
    Ep(a) @ L1873
    Xk(a) @ L1887
    A(a) @ L1913
    for(var c = 0; c < b.length;) @ L1919
    if(null != d.I) @ L1922
    if(d.Yb && 0 >= d.Zc && 0 <= d.Cc) @ L1927
    for(var f = !1, g = 0, h = this.va.H; g < h.length;) @ L1928
    if(0 == this.Cb) @ L1978
    Tm() @ L1999
    al() @ L2004
    for(var b = this.U.H, c = this.va.H, d = 0, e = this.U.Df ? b.length : 1; d < e;) @ L2008
    ha(a) @ L2026
    na(a, b) @ L2036
    vc() @ L2055
    static zd(a, b) @ L2061
  Statics:
    aa.b = !0 @ L9868
    aa.ad = [Ka] @ L9869
    aa.vl = function() { @ L10295

## Xa (L2076-2217)
  Fields:
    this.bf = ?
    this.ei = !1
    this.f = x.Ia(Xa.O)
    this.Lc = a.get("log")
    this.ji = a.get("log-contents")
    this.Fc = new Vb(a.get("autocompletebox"), function(c, d) {
    this.bf = !this.bf
  Methods:
    constructor() @ L2077
    switch(c.keyCode) @ L2115
    an() @ L2152
    if(!this.bf) @ L2155
    Af() @ L2162
    qk() @ L2166
    if(this.ei) @ L2168
    Zp(a, b, c) @ L2174
    switch(c) @ L2180
    switch(c) @ L2189
    il(a) @ L2197
    Hb(a) @ L2211
    static Gp(a) @ L2214
  Statics:
    Xa.b = !0 @ L10070
    Xa.O = "<div class='chatbox-view'><div class='chatbox-view-contents'><div data-hook='dr @ L10424
  Template: <div class='chatbox-view'><div class='chatbox-view-contents'><div data-hook='dra... @ L10424

## la (L2218-2245)
  Fields:
    this.ub = ""
    this.Jc = this.Mc = 0
  Methods:
    constructor() @ L2219
    De() @ L2223
    static Sh(a) @ L2230
    static gg(a) @ L2233
    static np() @ L2240
  Statics:
    la.b = !0 @ L9822

## Gc (L2246-2254)
  Fields:
    this.current = 0
    this.Ms = a
  Methods:
    constructor(a) @ L2247
    next() @ L2251
  Statics:
    Gc.b = !0 @ L10196

## Wb (L2255-2381)
  Fields:
    this.ci = null
    this.l = a
    this.ci = "@" + Y.replace(b, " ", "_"))
  Methods:
    constructor(a, b) @ L2256
    ij(a) @ L2261
    for(a = a.K; d < a.length;) @ L2265
    Gi(a) @ L2275
    zs(a) @ L2362
  Statics:
    Wb.b = !0 @ L9814

## Bc (L2382-2397)
  Methods:
    static rn() @ L2383
    if(0 == a.length) @ L2387
  Statics:
    Bc.b = !0 @ L9830

## ic (L2398-2450)
  Fields:
    this.Ga = 0
    this.Dk = this.Ek = !1
    this.Ye = 0
    this.f = window.document.createElement("div")
    this.Nq = this.fe("OVERTIME!", "overtime"))
    this.iq = ?
    this.hq = this.fe("0", "digit"))
    this.Pr = this.fe("0", "digit"))
    this.Or = this.fe("0", "digit"))
    this.Ye = a
    this.Ga = ?
    this.Dk = a)
    this.Ek = a)
  Methods:
    constructor() @ L2399
    fe(a, b) @ L2413
    fs(a) @ L2419
    if(a != this.Ye) @ L2420
    gs(a) @ L2432
    jm() @ L2438
    km() @ L2441
    bs(a) @ L2444
    hs(a) @ L2447
  Statics:
    ic.b = !0 @ L10098

## Ub (L2451-2473)
  Methods:
    static Mr(a, b) @ L2452
    static Nr(a, b) @ L2457
    static wm(a, b) @ L2462
  Statics:
    Ub.b = !0 @ L9670

## ub (L2474-2506)
  Fields:
    this.f = x.Ia(ub.O)
    this.nf = b.get("title")
    this.Di = b.get("reason")
    this.eo = b.get("ban-btn")
    this.ho = b.get("ban-text")
    this.df = b.get("kick")
    this.wd = b.get("close")
    this.Rb = a.Z
    this.bk = a
  Methods:
    constructor(a) @ L2475
    Tj(a) @ L2502
  Statics:
    ub.b = !0 @ L10110
    ub.O = "<div class='dialog kick-player-view'><h1 data-hook='title'></h1><div class=labe @ L10431
  Template: <div class='dialog kick-player-view'><h1 data-hook='title'></h1><div class=label... @ L10431

## ob (L2507-2658)
  Methods:
    static delete(a) @ L2508
    function() @ L2522
    static get(a) @ L2539
    static getAll() @ L2576
    static st() @ L2605
    static add(a) @ L2619
  Statics:
    ob.b = !0 @ L9855

## Wa (L2659-2774)
  Fields:
    this.jc = -1
    this.ic = null
    this.H = []
    this.H = []
    this.ic = b = new Wa), this.jc = a, Wa.zd(b, this))
  Methods:
    constructor() @ L2660
    ha(a) @ L2665
    for(; b < c;) @ L2669
    na(a) @ L2677
    for(; c < b;) @ L2681
    A(a) @ L2688
    for(var b = 0, c = this.H; b < c.length;) @ L2689
    for(b = this.H.length; a < b;) @ L2704
    if(0 != c.ca) @ L2709
    if(0 < g) @ L2717
    vc() @ L2749
    static zd(a, b) @ L2755
    for(; c < f;) @ L2764
  Statics:
    Wa.b = !0 @ L10033
    Wa.ad = [Ka] @ L10034

## vb (L2775-2831)
  Fields:
    this.Gf = null
    this.f = x.Ia(vb.O)
    this.Fh = a.get("change")
  Methods:
    constructor() @ L2776
    zi(a) @ L2796
    for(; c < d;) @ L2800
    ym(a) @ L2823
  Statics:
    vb.b = !0 @ L10066
    vb.O = "<div class='dialog change-location-view'><h1>Change Location</h1><div class='sp @ L10423
  Template: <div class='dialog change-location-view'><h1>Change Location</h1><div class='spl... @ L10423

## Fa (L2832-2911)
  Fields:
    this.lg = !1
    this.f = x.Ia(Fa.O)
    this.Ii = a
    this.rs = c.get("time")
    this.kr = c.get("progbar")
    this.Pp = c.get("leave")
    this.lg = !1, this.Fq())
  Methods:
    constructor(a) @ L2833
    for(; n < r.length;) @ L2878
    function(t) @ L2888
    A() @ L2902
    static ql(a) @ L2907
  Statics:
    Fa.b = !0 @ L10142
    Fa.O = "<div class='replay-controls-view'><button data-hook='reset'><i class='icon-to-s @ L10437
  Template: <div class='replay-controls-view'><button data-hook='reset'><i class='icon-to-st... @ L10437

## Ba (L2912-2961)
  Fields:
    this.Fd = ?
    this.f = x.Ia(Ba.O)
    this.fb = b.get("list")
    this.gi = b.get("join-btn")
    this.Ki = b.get("reset-btn")
  Methods:
    constructor(a) @ L2913
    function() @ L2937
    A(a, b, c, d) @ L2941
  Statics:
    Ba.b = !0 @ L10134
    Ba.O = "<div class='player-list-view'><div class='buttons'><button data-hook='join-btn' @ L10436
  Template: <div class='player-list-view'><div class='buttons'><button data-hook='join-btn'>... @ L10436

## uc (L2962-2971)
  Fields:
    this.hash = 0
    this.hash = (this.hash += a[b++]) + (this.hash << 10), this.hash ^= this
  Methods:
    constructor() @ L2963
    Ns(a) @ L2966
  Statics:
    uc.b = !0 @ L9577

## V (L2972-3091)
  Methods:
    constructor() @ L2973
    vs() @ L2974
    ks(a) @ L2977
    static gp() @ L2999
    static fp(a) @ L3018
    static Es(a, b) @ L3034
    for(; a < l;) @ L3047
    static Ls(a, b, c) @ L3062
    static Ks(a, b) @ L3077
  Statics:
    V.b = !0 @ L9659
    V.xh = { @ L10235
    V.Mm = { @ L10239

## B (L3092-3466)
  Methods:
    static Rp() @ L3099
    static jp() @ L3108
    static Fk(a) @ L3112
    static Gk(a, b) @ L3122
    static Vo(a, b) @ L3127
    switch(h.action) @ L3148
    static hr() @ L3166
    static xb() @ L3173
    if(9 != b.ke.Fe) @ L3177
    static Ik() @ L3199
    static oi(a, b) @ L3219
    static Wo() @ L3222
    if(!c.xt) @ L3231
    static Oh(a) @ L3323
    static Xo(a) @ L3331
    static eg(a, b, c) @ L3355
    function(r) @ L3421
    switch(r.qb) @ L3424
    switch(r.reason) @ L3429
    switch(r) @ L3447
  Statics:
    B.Xe = b @ L3102
    B.b = !0 @ L9844

## u (L3467-3480)
  Fields:
    this.Dg = null
    this.ba = a
    this.S = b
    this.Nh = c
    this.Lp = d
    this.D = e
    this.Qo = f
    this.C = h
    this.Vm = new xa
  Methods:
    constructor(a, b, c, d, e, f, g, h) @ L3468
  Statics:
    u.b = !0 @ L9893
    u.Pa = new u(0, 16777215, 0, -1, "Spectators", "t-spec", 0, 0) @ L10221
    u.ja = new u(1, 15035990, -1, 8, "Red", "t-red", 15035990, 2) @ L10222
    u.Da = new u(2, 5671397, 1, 16, "Blue", "t-blue", 625603, 4) @ L10223

## Ca (L3481-3585)
  Fields:
    this.rd = this.Ce = null
    this.Ae = []
    this.xk = 0
    this.Hl = !1
    this.ig = []
    this.cd = []
    this.La = new RTCPeerConnection({
    this.jg = new Promise(function(f) {
    this.ba = a
    this.Ce = window.setTimeout(M(this, this.Bp), a)
    this.Hd = this.xg = this.kd = null
  Methods:
    constructor(a, b, c) @ L3482
    bj(a) @ L3504
    Mo(a) @ L3528
    Rj(a) @ L3550
    Bp() @ L3557
    Xh() @ L3560
    la() @ L3564
    nk() @ L3568
    for(; a < b.length;) @ L3577
  Statics:
    Ca.b = !0 @ L9618
    Ca.ad = [Dc] @ L9619
    Ca.Ho = { @ L10228

## wc (L3586-0)
  Statics:
    wc.b = !0 @ L9772
    wc.channels = [{ @ L10260

## I (L3587-3666)
  Fields:
    this.Sg = ?
    this.Tg = this.ya = null
    this.uk = 0
    this.ea = this.$ = this.ge = null
    this.Hc = 0
    this.o = 1
    this.i = 63
    this.C = 32
    this.vb = 1 / 0
    this.bb = !0
    this.S = 0
    this.ea = b[a.F()]
    this.Hc = 0 != (c & 1) ? a.w() : 0
    this.vb = 0 != (c & 2) ? a.w() : 1 / 0
    this.S = 0 != (c & 4) ? a.N() : 0
    this.bb = 0 != (c & 8)
    this.o = ?
    this.i = a.N()
    this.C = a.N()
    this.ea = b
    this.Hc = -this.Hc
    this.vb = 1 / Math.tan(a / 2))
    this.ge = new P(b.x + c + -a * d, b.y + a + c * d)
    this.uk = Math.sqrt(c * c + a * a)
    this.Sg = new P(-(c.y - a.y), c.x - a.x)
    this.Tg = new P(-(c.y - a.y), c.x - a.x)
    this.ya = new P(a / b, c / b)
  Methods:
    constructor() @ L3588
    ha(a) @ L3601
    na(a, b) @ L3616
    Vc(a) @ L3629
    if(0 > a) @ L3631
    kp() @ L3640
    re() @ L3643
    if(0 == 0 * this.vb) @ L3644
  Statics:
    I.b = !0 @ L10042
    I.Qn = .17435839227423353 @ L10419
    I.Pn = 5.934119456780721 @ L10420

## C (L3667-3746)
  Methods:
    static ih(a) @ L3675
    static xj(a) @ L3692
    static Us(a) @ L3717
    for(; e < c.length;) @ L3722
    static it(a) @ L3729
    static Oa(a) @ L3742
  Statics:
    C.b = !0 @ L9845

## Ab (L3747-3812)
  Fields:
    this.S = 0
    this.ze = 1 / 0
    this.Ib = this.fc = 100
    this.he = this.ie = 0
    this.he = a.F()
    this.ie = a.F()
    this.Ib = ?
    this.fc = a.w()
    this.ze = a.w()
    this.S = a.N()
  Methods:
    constructor() @ L3748
    ha(a) @ L3754
    na(a) @ L3762
    A(a) @ L3771
    if(null != b && null != a) @ L3774
    if(this.Ib >= this.fc) @ L3785
  Statics:
    Ab.b = !0 @ L10028
    Ab.ad = [Ka] @ L10029

## Sa (L3813-3817)
  Fields:
    this.gq = a
  Methods:
    constructor(a) @ L3814
  Statics:
    Sa.b = !0 @ L9881

## jb (L3818-3851)
  Fields:
    this.fk = a
    this.hj = b
    this.rc = a
    this.jf = window.performance.now()
    this.rc = this.fk, this.jf = a)
  Methods:
    constructor(a, b) @ L3819
    cn() @ L3825
    qs() @ L3831
    Io(a) @ L3838
    A() @ L3844
  Statics:
    jb.b = !0 @ L9800

## bc (L3852-3900)
  Fields:
    this.Qc = new Set
    this.ng = 0
    this.ng = a
    this.ng = 0
  Methods:
    constructor() @ L3853
    la() @ L3858
    A() @ L3861
    if(null != this.Bg && a != this.ng) @ L3869
    Fa(a) @ L3876
    ld(a) @ L3881
    vq(a) @ L3885
    lq(a) @ L3888
    Al() @ L3891
    if(null != this.Bg && 0 != this.ng) @ L3892
  Statics:
    bc.b = !0 @ L9818

## xc (L3901-3927)
  Fields:
    this.Wc = 0
    this.fb = []
    this.os = new da(["Time is", "Up!"], 16777215)
    this.rr = new da(["Red is",
    this.qr = new da(["Red", "Scores!"], 15035990)
    this.lo = new da(["Blue is", "Victorious!"], 625603)
    this.ko = new da(["Blue", "Scores!"], 625603)
    this.Pq = new da(["Game", "Paused"], 16777215)
    this.fb = []
    this.Wc = 0
    this.Wc = 0, this.fb.shift())
  Methods:
    constructor() @ L3902
    Qa(a) @ L3914
    wo() @ L3917
    A(a) @ L3921
    Rc(a) @ L3924
  Statics:
    xc.b = !0 @ L10058

## Bb (L3928-3951)
  Fields:
    this.Ck = null
    this.f = x.Ia(Bb.O)
    this.og = a.get("link")
    this.Ck = a, this.og.value = a)
  Methods:
    constructor() @ L3929
  Statics:
    Bb.b = !0 @ L10146
    Bb.O = "<div class='dialog basic-dialog room-link-view'><h1>Room link</h1><p>Use this u @ L10438
  Template: <div class='dialog basic-dialog room-link-view'><h1>Room link</h1><p>Use this ur... @ L10438

## Ya (L3952-4086)
  Fields:
    this.uj = []
    this.Xs = a
    this.Ma = x.Ia(Ya.Ij)
    this.Ej = c.get("refresh")
    this.un = c.get("join")
    this.Ss = c.get("count")
    this.Ws = b("fil-full", !0)
    this.nt = b("fil-pass", !0)
    this.Vs = b("fil-empty", !0)
    this.ct = c.get("listscroll")
    this.pt = nb.mi(this.ct)
    this.yj = c.get("list")
    this.uj = []
    this.uj = a
    this.Xd = a
  Methods:
    constructor(a) @ L3953
    qn() @ L4017
    Fn(a) @ L4036
    for(; h < a.length;) @ L4050
    Kn(a) @ L4071
    static ot(a) @ L4077
  Statics:
    Ya.b = !0 @ L10154
    Ya.Ij = "<div class='roomlist-view'><div class='notice' data-hook='notice' hidden><div d @ L10440

## qa (L4087-4091)
  Methods:
    static h(a, b, c) @ L4088
  Statics:
    qa.b = !0 @ L9797

## Eb (L4092-4132)
  Fields:
    this.f = x.Ia(Eb.O)
    this.nf = c.get("name")
    this.Xf = c.get("admin")
    this.df = c.get("kick")
    this.wd = c.get("close")
    this.Rb = a.Z
    this.qe = a
    this.Ql = a
  Methods:
    constructor(a, b) @ L4093
    A(a, b) @ L4116
    Bs(a) @ L4120
    Xj(a) @ L4124
    Wj(a) @ L4128
  Statics:
    Eb.b = !0 @ L10126
    Eb.O = "<div class='dialog' style='min-width:200px'><h1 data-hook='name'></h1><button d @ L10434
  Template: <div class='dialog' style='min-width:200px'><h1 data-hook='name'></h1><button da... @ L10434

## qc (L4133-4152)
  Fields:
    this.Og = b
    this.Mf = this.qf = 0
    this.qf = 0)
  Methods:
    constructor(a) @ L4134
    Qa(a) @ L4141
    co() @ L4148
  Statics:
    qc.b = !0 @ L9768

## q (L4153-5317)
  Fields:
    this.L = []
    this.X = []
    this.sa = []
    this.wc = []
    this.H = []
    this.rb = []
    this.Md = []
    this.vd = []
    this.Kd = new Sb
    this.Mh = 255
    this.Ue = this.mf = 0
    this.Df = !1
    this.D = a.Ab()
    this.ud = a.N()
    this.ce = a.w()
    this.be = a.w()
    this.bd = a.w()
    this.Gc = a.w()
    this.Te = a.w()
    this.td = a.N()
    this.bc = a.w()
    this.tc = a.w()
    this.mc = a.w()
    this.mf = a.Sb()
    this.Ue = a.F()
    this.Df = 0 != a.F()
    this.L = []
    this.X = []
    this.sa = []
    this.wc = []
    this.H = []
    this.rb = []
    this.Md = b()
    this.vd = b()
    this.L = []
    this.X = []
    this.sa = []
    this.wc = []
    this.H = []
    this.rb = []
    this.D = w.J(d.name, String)
    this.bc = w.J(d.width, E)
    this.tc = w.J(d.height, E)
    this.mf = this.me(d, "maxViewWidth") | 0
    this.Ue = 1)
    this.mc = ?
    this.mc = w.J(a, E))
    this.ud = e
    this.ce = this.me(a, "width")
    this.be = this.me(a, "height")
    this.bd = this.me(a, "kickOffRadius")
    this.Gc = this.me(a, "cornerRadius")
    this.td = 7441498
    this.td = q.pg(a.color))
    this.Te = this.me(a, "goalLine")
    this.Df = "full" == d.kickOffReset
    this.Kd = q.Vp(a))
    this.D = a
    this.bc = b
    this.tc = c
    this.ud = 1
    this.td = 7441498
    this.ce = d
    this.be = e
    this.bd = g
    this.Gc = h
    this.mc = .75 * d
    this.mc = 400)
    this.D = a
    this.bc = b
    this.tc = c
    this.ud = 2
    this.ce = d
    this.be = e
    this.bd = 75
    this.Gc = h
    this.Te = g
    this.mc = .75 * (d - g)
    this.mc = 400)
  Methods:
    constructor() @ L4154
    rg() @ L4169
    ha(a) @ L4180
    for(var b = 0, c = this.L.length; b < c;) @ L4201
    ys(a) @ L4230
    for(; h < g;) @ L4235
    hn() @ L4287
    re() @ L4290
    cf() @ L4296
    me(a, b) @ L4299
    Yp(a) @ L4303
    De() @ L4307
    us() @ L4310
    for(var b = 0, c = [], d = 0, e = this.L; d < e.length;) @ L4313
    for(var n = this.Md; l < n.length;) @ L4338
    for(r = this.vd; n < r.length;) @ L4345
    switch(this.ud) @ L4371
    fl(a) @ L4390
    for(r = 0; r < n.length;) @ L4405
    switch(a.type) @ L4433
    c(this.X, "segments", function(h) @ L4459
    c(this.H, "discs", function(h) @ L4463
    c(this.rb, "joints", function(h) @ L4467
    mk() @ L4478
    to(a, b) @ L4488
    for(; c < d.length;) @ L4491
    jd(a, b, c, d, e, f, g, h) @ L4503
    kl(a, b, c, d, e, f, g, h) @ L4639
    sg(a, b, c, d, e, f) @ L4714
    ll(a, b) @ L4786
    jl(a, b, c) @ L4855
    static na(a) @ L4940
    static Uh() @ L4945
    if(null == q.wb) @ L4946
    for(; a < b;) @ L4980
    static ao(a, b) @ L4987
    for(; c < d.length;) @ L4991
    static mo(a) @ L4998
    static Kc(a) @ L5016
    static Pc(a, b, c, d) @ L5062
    static Eg(a, b, c) @ L5065
    static Ao(a) @ L5068
    static pg(a) @ L5072
    static Gs(a) @ L5078
    static Xp(a) @ L5088
    static Rr(a, b) @ L5100
    static Wp(a, b) @ L5117
    static Jp(a) @ L5139
    static Tp(a, b) @ L5150
    static Rq(a) @ L5166
    static Up(a) @ L5176
    static rp(a) @ L5199
    static Sp(a) @ L5206
    switch(a.team) @ L5216
    static Uq(a) @ L5229
    static Vp(a) @ L5246
    static Uo(a, b) @ L5273
    static gl(a, b) @ L5287
    if(null != c) @ L5298
    static pa(a, b, c, d) @ L5314
  Statics:
    q.wb = [] @ L4947
    q.b = !0 @ L9885
    q.ss = A.ka(1024) @ L10312

## zb (L5318-5323)
  Fields:
    this.f = x.Ia(zb.O)
  Methods:
    constructor(a) @ L5319
  Statics:
    zb.b = !0 @ L10182
    zb.O = '<div class=\'unsupported-browser-view\'><div class=\'dialog\'><h1>Unsupported B @ L10447
  Template: <div class=\'unsupported-browser-view\'><div class=\'dialog\'><h1>Unsupported Br... @ L10447

## ca (L5324-5350)
  Fields:
    this.f = ?
    this.ee = d.get("content")
  Methods:
    constructor(a, b, c) @ L5325
    for(; h < c.length;) @ L5337
  Statics:
    ca.b = !0 @ L10174
    ca.O = "<div class='simple-dialog-view'><div class='dialog basic-dialog'><h1 data-hook= @ L10445
  Template: <div class='simple-dialog-view'><div class='dialog basic-dialog'><h1 data-hook='... @ L10445

## za (L5351-5450)
  Fields:
    this.ul = this.tl = this.wl = null
    this.jb = new hb
    this.od = !1
    this.Jf = new Fb
    this.Ka = new Xa
    this.Xa = new ib(a)
    this.f = x.Ia(za.O)
    this.ws = ?
    this.yf = a.get("popups")
    this.ri = a.get("menu")
    this.ul = a, this.f.style.setProperty("--chat-opacity", "" + a))
    this.tl = a, this.f.classList.toggle("chat-bg-full", a))
    this.wl = a, this.jb.f.classList.toggle("restricted", a))
    this.od = a, this.f.classList.toggle("showing-room-view", this.od), th
    this.Yl = b) : (this.yf.style.display = "none", this.Yl = null)
  Methods:
    constructor(a) @ L5352
    Wr(a) @ L5411
    Vr(a) @ L5414
    es(a) @ L5417
    A(a) @ L5420
    xe(a) @ L5438
    ab(a, b) @ L5445
  Statics:
    za.Vq = a @ L5447
    za.b = !0 @ L10106
    za.O = "<div class='game-view' tabindex='-1'><div class='gameplay-section' data-hook='g @ L10430
  Template: <div class='game-view' tabindex='-1'><div class='gameplay-section' data-hook='ga... @ L10430

## Vb (L5451-0)
  Fields:
    this.tr = /[#@][^\s@#]*$/
    this.Qb = a
    this.Cq = b
    this.Zk = "#" == c.charAt(0)
    this.Hi = b.index
    this.Gr = c.length
    this.mm = a
    this.dd = null
    this.dd = b
    this.Ac = 0
    this.Ac = a : this.Ac > a && (this.Ac = 0)
  Methods:
    constructor(a, b) @ L5452
    ai() @ L5459
    qo(a, b) @ L5462
    if(null != b) @ L5464
    for(; g < h;) @ L5471
    Hk(a) @ L5497
    jj(a) @ L5501
    if(b) @ L5506
    for(var d = 0; d < a.length;) @ L5509
    ik(a) @ L5530
    if(null != this.dd) @ L5531
    Yo() @ L5546
    static cp(a) @ L5549
  Statics:
    Vb.b = !0 @ L10074

## Cb (L5553-5571)
  Fields:
    this.rl = a.get("notice")
    this.Jo = a.get("notice-contents")
    this.wd = a.get("notice-close")
  Methods:
    constructor(a) @ L5554
    im() @ L5560
  Statics:
    Cb.xo = c @ L5566
    Cb.b = !0 @ L10158

## ac (L5572-5576)
  Fields:
    this.Fe = a
  Methods:
    constructor(a) @ L5573
  Statics:
    ac.b = !0 @ L9773

## oc (L5577-5579)
  Methods:
    constructor() @ L5578
  Statics:
    oc.b = !0 @ L9840

## xb (L5580-5609)
  Fields:
    this.f = x.Ia(xb.O)
    this.Db = c.get("input")
    this.rf = c.get("ok")
  Methods:
    constructor(a) @ L5581
    Ic() @ L5601
    A() @ L5606
  Statics:
    xb.b = !0 @ L10078
    xb.O = "<div class='choose-nickname-view'><img src=\"images/haxball.png\" /><div class= @ L10425
  Template: <div class='choose-nickname-view'><img src=\"images/haxball.png\" /><div class='... @ L10425

## dc (L5610-5730)
  Fields:
    this.yh = this.Jh = !1
    this.ua = new Ca(0, b, d)
    this.aa = null)
    this.ua = null)
    this.Jh = !0
  Methods:
    constructor(a, b, c, d, e, f) @ L5611
    po() @ L5649
    pk() @ L5652
    je(a) @ L5656
    switch(a) @ L5665
    Zh(a, b) @ L5678
    Yh(a) @ L5693
    if(null != this.aa) @ L5698
    Qi(a, b, c) @ L5705
    Ni(a) @ L5713
    static lp(a) @ L5718
    switch(a.qb) @ L5719
  Statics:
    dc.b = !0 @ L9612

## Yb (L5731-5741)
  Methods:
    static rh(a) @ L5732
  Statics:
    Yb.b = !0 @ L9676

## S (L5742-5768)
  Fields:
    this.C = 32
    this.i = 63
    this.o = 1
    this.Va = 0
    this.ya = new P(0, 0)
    this.Va = a.w()
    this.o = a.w()
    this.i = a.N()
    this.C = a.N()
  Methods:
    constructor() @ L5743
    ha(a) @ L5750
    na(a) @ L5759
  Statics:
    S.b = !0 @ L10038

## Oc (L5769-5786)
  Methods:
    static description(a) @ L5770
    switch(a) @ L5771

## ba (L5787-5811)
  Fields:
    this.f = b.f
  Methods:
    constructor(a) @ L5788
  Statics:
    ba.gm = function(e) { @ L5802
    ba.gm = null @ L5806
    ba.b = !0 @ L10138

## Q (L5812-5821)
  Methods:
    static Je(a) @ L5813
    static parseInt(a) @ L5816
  Statics:
    Q.b = !0 @ L9574

## va (L5822-5999)
  Fields:
    this.jc = -1
    this.U = this.ic = null
    this.Gd = 2
    this.gd = 0
    this.ne = 1
    this.mb = this.Ga = 3
    this.Bc = !1
    this.M = null
    this.K = []
    this.lc = ""
    this.U = q.Uh()[0]
    this.ob = [null, new xa, new xa]
    this.M = new aa
    this.lc = a.Ab()
    this.Bc = 0 != a.F()
    this.mb = a.N()
    this.Ga = a.N()
    this.ne = a.Ci()
    this.gd = a.F()
    this.Gd = a.F()
    this.U = q.na(a)
    this.M = null
    this.M = new aa, this.M.na(a, this))
    this.om = a
    this.Gd = 0 > b ? 0 : 255 < b ? 255 : b
    this.gd = 0 > c ? 0 : 255 < c ? 255 : c
    this.ne = this.gd * d
    this.ic = b = new va), this.jc = a, va.zd(b, this))
  Methods:
    constructor() @ L5823
    ms(a) @ L5839
    if(null == this.M) @ L5840
    for(var b = 0, c = this.K; b < c.length;) @ L5842
    ag(a, b, c) @ L5852
    if(b.fa != c) @ L5853
    if(null != this.M) @ L5857
    for(; !e;) @ L5863
    for(; f < g.length;) @ L5868
    if(h != b && h.fa == b.fa && h.Nb == d) @ L5871
    ma(a) @ L5882
    for(; b < c.length;) @ L5885
    A(a) @ L5892
    ha(a) @ L5895
    na(a) @ L5913
    for(d = 0; d < c;) @ L5928
    Pk() @ L5936
    ip() @ L5944
    Bo(a) @ L5949
    Jm(a) @ L5953
    Pb(a) @ L5956
    Zr(a, b, c, d) @ L5961
    vc() @ L5968
    static zd(a, b) @ L5974
    for(; c < f;) @ L5984
  Statics:
    va.b = !0 @ L9897
    va.ad = [Ka, fc] @ L9898

## mc (L6000-6033)
  Fields:
    this.r = new RegExp(a, b.split("u").join(""))
  Methods:
    constructor(a, b) @ L6001
    match(a) @ L6004
    yn(a) @ L6010
    et() @ L6014
    dt(a, b) @ L6021
    if(this.r.global) @ L6024
  Statics:
    mc.b = !0 @ L9567

## G (L6034-6059)
  Fields:
    this.Dd = 0
    this.C = 32
    this.i = 63
    this.o = 1
    this.a = new P(0, 0)
    this.o = a.w()
    this.i = a.N()
    this.C = a.N()
  Methods:
    constructor() @ L6035
    ha(a) @ L6042
    na(a) @ L6050
  Statics:
    G.b = !0 @ L10046

## Hb (L6060-6139)
  Fields:
    this.mg = !1
    this.D = ""
    this.Bh = 0
    this.Zf = ""
    this.ob = new xa
    this.Kb = a.getContext("2d", null)
    this.ak = null
    this.Vl = a.getContext("2d", null)
    this.Zf = d, this.Bh = -1) : (this.Zf = "" + a.Nb, this.Bh = a.Nb), th
    this.To = 0 < b.M.Ta || !a.Yb ? "black" : a.Yb && 0 >= a.Zc && 0 <= a.
    this.D = a.D, this.Cs())
    this.ak = this.Kb.createPattern(this.Kb.canvas,
  Methods:
    constructor() @ L6061
    Oo() @ L6074
    Cs() @ L6080
    A(a, b) @ L6093
    if(null != a.I) @ L6094
    sr(a) @ L6104
    static uo(a, b) @ L6121
    for(; c < d;) @ L6128
    static Ko(a, b) @ L6134
  Statics:
    Hb.b = !0 @ L10062

## sa (L6140-6208)
  Fields:
    this.fd = new Map
  Methods:
    constructor() @ L6141
    Qa(a, b) @ L6144
    v(a) @ L6147
    ur(a) @ L6150
    mp(a) @ L6153
    for(; !d.done;) @ L6157
    De() @ L6164
    for(; !c.done;) @ L6168
    static gg(a) @ L6175
    for(; d < c.length;) @ L6179
    static Sh(a) @ L6186
    static wk() @ L6189
  Statics:
    sa.b = !0 @ L9835

## Fb (L6209-6224)
  Fields:
    this.Nl = new zc
    this.f = x.Ia(Fb.O)
    this.Fg = a.get("ping")
    this.ep = a.get("fps")
  Methods:
    constructor() @ L6210
    cs(a, b) @ L6218
    Hm(a) @ L6221
  Statics:
    Fb.b = !0 @ L10178
    Fb.O = "<div class=\"stats-view-container\"><div class='stats-view'><p data-hook='ping' @ L10446
  Template: <div class=\"stats-view-container\"><div class='stats-view'><p data-hook='ping'>... @ L10446

## yb (L6225-6237)
  Fields:
    this.f = x.Ia(yb.O)
    this.Lc = a.get("log")
    this.Eh = a.get("cancel")
  Methods:
    constructor() @ L6226
    da(a) @ L6232
  Statics:
    yb.b = !0 @ L10082
    yb.O = "<div class='connecting-view'><div class='dialog'><h1>Connecting</h1><div class= @ L10426
  Template: <div class='connecting-view'><div class='dialog'><h1>Connecting</h1><div class='... @ L10426

## Ka (L6238-0)
  Statics:
    Ka.b = !0 @ L9712
    Ka.wh = !0 @ L9713

## ec (L6239-6366)
  Fields:
    this.za = a
    this.da = b
  Methods:
    constructor(a, b) @ L6240
    xf(a) @ L6244
    switch(b) @ L6250
    if(2 == a.length) @ L6295
    switch(a[1]) @ L6296
    Fm(a) @ L6332
    static Oq(a) @ L6337
    switch(a[1]) @ L6343
    if(4 < a.length) @ L6358
  Statics:
    ec.b = !0 @ L9805

## kc (L6367-6443)
  Fields:
    this.th = null
    this.wt = .025
    this.He = this.qh = this.Sf = 0
    this.fh = ?
    this.wn = a
    this.Sf = this.qh = 0)
    this.th = null, this.He = 0)
    this.qh = a
    this.Sf = 166.66666666666666
    this.th = window.setInterval(function() {
    this.wn = window.performance.now())
  Methods:
    constructor(a, b) @ L6368
    update() @ L6381
    Fj(a) @ L6392
    connect(a) @ L6401
    zt(a) @ L6404
    for(a = a.K; L < a.length;) @ L6420
    if(N.fa == u.ja) @ L6429
  Statics:
    kc.b = !0 @ L9860

## p (L6444-6496)
  Fields:
    this.Hn = this.In = this.qc = 0
  Methods:
    constructor() @ L6445
    Za() @ L6448
    Cn() @ L6451
    apply() @ L6454
    wa() @ L6457
    xa() @ L6460
    static Ha(a) @ L6463
    static Ja(a) @ L6468
    static Cj(a, b) @ L6475
    static Jj(a) @ L6481
    static yt(a) @ L6489
  Statics:
    p.yb = !0 @ L9305
    p.yb = !1 @ L9307
    p.b = !0 @ L9678
    p.yb = !1 @ L10248
    p.wj = new Map @ L10249
    p.Nf = 0 @ L10250

## T (L6497-6833)
  Fields:
    this.hd = window.performance.now()
    this.Ug = new Map
    this.nd = new Map
    this.ue = 1
    this.Ch = 100
    this.Wg = ?
    this.Ld = 0
    this.Ig = 1.5
    this.Ya = new P(0, 0)
    this.Yk = !1
    this.Cd = new xc
    this.Hp = a
    this.oa = window.document.createElement("canvas")
    this.c = this.oa.getContext("2d", {
    this.tp = this.c.createPattern(m.sp, null)
    this.Fo = this.c.createPattern(m.Eo, null)
    this.Do = this.c.createPattern(m.Co, null)
    this.hd = c
    this.Yk = a)
  Methods:
    constructor(a) @ L6498
    xp(a, b) @ L6522
    Ds() @ L6532
    if(null != this.oa.parentElement) @ L6533
    Rc(a, b) @ L6541
    if(null != a.M) @ L6549
    for(var r = 0, t = a.K; r < t.length;) @ L6563
    vr(a) @ L6602
    As(a, b, c, d, e) @ L6613
    Go(a, b, c) @ L6645
    Ar(a) @ L6650
    zr(a) @ L6658
    Yr(a) @ L6663
    Dr(a) @ L6681
    yr(a, b) @ L6725
    for(a = a.K; d < a.length;) @ L6729
    lm(a, b) @ L6740
    Cr(a) @ L6744
    if(null != a) @ L6745
    xr(a, b) @ L6750
    Br(a) @ L6759
    if(a.bb) @ L6760
    wr(a, b, c) @ L6775
    Jk(a, b, c, d) @ L6784
    Kk(a, b, c) @ L6804
    Ir() @ L6816
    for(; !b.done;) @ L6819
    static nc(a) @ L6825
    static Vi(a, b) @ L6828
  Statics:
    T.b = !0 @ L10050

## fc (L6834-0)
  Statics:
    fc.b = !0 @ L9695
    fc.wh = !0 @ L9696

## ya (L6835-6910)
  Fields:
    this.i = this.C = 63
    this.S = 16777215
    this.Ea = .99
    this.ca = 1
    this.o = .5
    this.V = 10
    this.ra = new P(0, 0)
    this.G = new P(0, 0)
    this.a = new P(0, 0)
    this.V = a.w()
    this.o = a.w()
    this.ca = a.w()
    this.Ea = a.w()
    this.S = ?
    this.i = a.N()
    this.C = a.N()
  Methods:
    constructor() @ L6836
    ha(a) @ L6847
    na(a) @ L6865
    aq() @ L6884
    Wk(a) @ L6889
  Statics:
    ya.b = !0 @ L9864

## W (L6911-6919)
  Fields:
    this.Y = 0
    this.T = a
  Methods:
    constructor(a) @ L6912
    Za(a) @ L6915
  Statics:
    W.yb = !0 @ L8264
    W.yb = !1 @ L8266
    W.yb = !0 @ L8553
    W.yb = !1 @ L8555
    W.yb = !0 @ L8843
    W.yb = !1 @ L8845
    W.b = !0 @ L9686
    W.yb = !1 @ L10251

## Ic (L6920-6929)
  Methods:
    static on(a) @ L6921
    if(null != a) @ L6923
  Statics:
    Ic.b = !0 @ L9573

## H (L6930-6935)
  Methods:
    static h(a) @ L6931
  Statics:
    H.b = !0 @ L9795

## nb (L6936-6942)
  Methods:
    static mi(a) @ L6937
  Statics:
    nb.b = !0 @ L9669
    nb.Cp = ["click-rail", @ L10245

## w (L6943-7069)
  Methods:
    static pn(a) @ L6944
    static Pe(a, b) @ L6954
    switch(c) @ L6959
    if(a.Gb) @ L6963
    if(d.Oe) @ L6966
    for(d = d.Oe; f < d.length;) @ L6970
    if(a instanceof Array) @ L6981
    static Nj(a, b) @ L7008
    for(;;) @ L7009
    for(; d < e;) @ L7016
    static Un(a, b) @ L7024
    switch(b) @ L7026
    if("function" == typeof b) @ L7042
    static Tn(a, b) @ L7051
    static J(a, b) @ L7054
    static Oj(a) @ L7058
    static Vn(a) @ L7063
    static Wn(a) @ L7066
  Statics:
    w.b = !0 @ L10200
    w.Xn = {}.toString @ L10227

## Db (L7070-7090)
  Fields:
    this.Ma = x.Ia(Db.Ij, "tbody")
    this.tt = a
  Methods:
    constructor(a) @ L7071
  Statics:
    Db.b = !0 @ L10150
    Db.Ij = "<tr><td><span data-hook='tag'></span><span data-hook='name'></span></td><td dat @ L10439

## Ea (L7091-0)
  Statics:
    Ea.b = !0 @ L9809
    Ea.fb = ["Afghanistan", "AF", 33.3, 65.1, "Albania", "AL", 41.1, 20.1, "Algeria", "DZ",  @ L10274

## yc (L7092-7137)
  Fields:
    this.f = ?
    this.jo = b.get("sound-bar")
    this.Dp = b.get("sound-icon")
    this.io = b.get("sound-bar-bg")
    this.Np = a, (this.Mp = b) && (a = 0), this.Dp.className = "icon-" + (
  Methods:
    constructor(a) @ L7093
    A() @ L7132
  Statics:
    yc.b = !0 @ L10102

## zc (L7138-7177)
  Fields:
    this.Lh = 0
    this.fq = 400
    this.Tk = 64
    this.lj = 32
    this.oa = window.document.createElement("canvas")
    this.fg = window.document.createElement("canvas")
    this.f = window.document.createElement("div")
    this.Ph = this.fg.getContext("2d", null)
    this.c = this.oa.getContext("2d", null)
    this.Qq = a
    this.Lh = 0)
  Methods:
    constructor() @ L7139
    Yn(a) @ L7161
  Statics:
    zc.b = !0 @ L10122

## Rb (L7178-7211)
  Fields:
    this.D = ha.Xc(this.D, 40)
    this.ub = ha.Xc(this.ub, 3)
    this.Fe = a.Sb()
    this.D = a.em()
    this.ub = a.em()
    this.Jc = a.Bi()
    this.Mc = a.Bi()
    this.Jb = 0 != a.F()
    this.lf = a.F()
    this.K = a.F()
  Methods:
    constructor() @ L7179
    hk() @ L7180
    ha(a) @ L7184
    na(a) @ L7197
  Statics:
    Rb.b = !0 @ L9850

## Nc (L7212-7239)
  Methods:
    static xj() @ L7213
  Statics:
    Nc.b = !0 @ L9987

## Ob (L7240-7249)
  Fields:
    this.Ma = a
    this.value = b
    this.value = a, this.Ma.textContent = "" + this.value)
  Methods:
    constructor(a, b) @ L7241
    set(a) @ L7246
  Statics:
    Ob.b = !0 @ L9671

## m (L7250-0)
  Statics:
    m.Ra = new jc(d) @ L3700
    m.b = !0 @ L9839
    m.Js = "wss://p2p.haxball.com/" @ L10289
    m.Se = "https://www.haxball.com/rs/" @ L10290
    m.kg = [{ @ L10291
    m.j = new lc @ L10294

## Ac (L7251-7294)
  Fields:
    this.zn = 0
    this.version = ?
    this.oh = 0
    this.Wd = A.ka(1E3)
    this.Rf = A.ka(16384)
    this.version = b
    this.oh = a.Y
    this.zj = a
  Methods:
    constructor(a, b) @ L7252
    stop() @ L7281
  Statics:
    Ac.b = !0 @ L9708

## xa (L7295-7317)
  Fields:
    this.pd = 16777215
    this.ib = []
    this.sd = a.F()
    this.pd = a.N()
    this.ib = []
  Methods:
    constructor() @ L7296
    ha(a) @ L7300
    na(a) @ L7308
  Statics:
    xa.b = !0 @ L9889

## wb (L7318-7352)
  Fields:
    this.D = a.D
    this.zb = a.zb
    this.ba = a.Z
    this.f = x.Ia(wb.O)
    this.nf = b.get("name")
    this.Fg = b.get("ping")
    this.zb = a.zb, this.Fg.textContent = "" + this.zb)
    this.Zn = a
  Methods:
    constructor(a) @ L7319
    A(a, b) @ L7343
    Em(a) @ L7348
  Statics:
    wb.b = !0 @ L10130
    wb.O = "<div class='player-list-item'><div data-hook='flag' class='flagico'></div><div  @ L10435
  Template: <div class='player-list-item'><div data-hook='flag' class='flagico'></div><div d... @ L10435

## Gb (L7353-7367)
  Methods:
    static Qp() @ L7354
  Statics:
    Gb.Ai = new Promise(function(a, b) { @ L7356
    Gb.b = !0 @ L9663

## gc (L7368-7406)
  Fields:
    this.gt = a
    this.eb = []
    this.Zd = 0
  Methods:
    constructor(a) @ L7369
    add(a) @ L7373
    for(; d < b;) @ L7377
    mh() @ L7394
    max() @ L7403
  Statics:
    gc.b = !0 @ L9700

## Da (L7407-7671)
  Fields:
    this.cg = null
    this.cl = this.Kh = !1
    this.hd = window.performance.now()
    this.Nd = null
    this.Re = 0
    this.so = new jb(3, 1E3)
    this.W = new bc
    this.Ng = "Waiting for link"
    this.Mi = this.Am = !1
    this.Bd = 0
    this.dg = new ec(a, function(d) {
    this.za = a
    this.l = new za(a.yc)
    this.Th = new Wb(this.l, a.T.ma(a.yc).D)
    this.Rh = window.setInterval(function() {
    this.kj = window.setInterval(function() {
    this.Nd = new Ac(this.za, 3)
    this.Re = window.requestAnimationFrame(M(this, this.sf))
    this.hd = a, this.Bd++, a = this.za.T.ma(this.za.yc), null != a && (th
    this.Kh = a
    this.cg = window.setTimeout(function() {
    this.cl = a)
  Methods:
    constructor(a) @ L7408
    if(null != e) @ L7480
    ns() @ L7526
    js(a) @ L7529
    la() @ L7541
    Hr(a) @ L7553
    for(; c < d.length;) @ L7557
    sf() @ L7564
    Rc() @ L7570
    qq(a) @ L7574
    pq(a) @ L7582
    Bm(a) @ L7590
    bn() @ L7593
    if(null != this.za.T.M) @ L7594
    Fa(a) @ L7600
    switch(a.keyCode) @ L7603
    ld(a) @ L7647
    static xm(a) @ L7650
    static lr(a) @ L7654
    for(var f = 0; f < b.length;) @ L7659
  Statics:
    Da.b = !0 @ L9810

## wa (L7672-7750)
  Fields:
    this.Dc = -1
    this.En = null
    this.vn = -Infinity
    this.fa = u.Pa
    this.I = null
    this.Cc = this.Zc = 0
    this.Yb = !1
    this.W = this.Z = 0
    this.D = "Player"
    this.gh = this.zb = 0
    this.country = null
    this.Ud = !1
    this.Zb = this.Sd = null
    this.Nb = 0
    this.cb = !1
    this.cb = 0 != a.F()
    this.Nb = a.N()
    this.Zb = a.Ab()
    this.Sd = a.Ab()
    this.Ud = 0 != a.F()
    this.country = a.Ab()
    this.gh = a.N()
    this.D = a.Ab()
    this.W = a.N()
    this.Z = a.Bb()
    this.Yb = 0 != a.F()
    this.Cc = a.Ci()
    this.Zc = a.F()
    this.fa = 1 == c ? u.ja : 2 == c ? u.Da : u.Pa
    this.I = 0 > a ? null : b[a]
    this.En = b = new wa), this.Dc = a, wa.Ps(b, this))
  Methods:
    constructor() @ L7673
    xa(a) @ L7690
    wa(a, b) @ L7707
    Ys() @ L7726
    static Ps(a, b) @ L7732
  Statics:
    wa.b = !0 @ L9902
    wa.ad = [Ka] @ L9903

## ua (L7751-0)
  Statics:
    ua.b = !0 @ L9714
    ua.Dc = 0 @ L10259

## D (L7752-7756)
  Methods:
    static h(a, b) @ L7753
  Statics:
    D.b = !0 @ L9796

## Jc (L7757-7762)
  Fields:
    this.x = a
    this.y = b
  Methods:
    constructor(a, b) @ L7758
  Statics:
    Jc.b = !0 @ L9786

## Lc (L7763-7773)
  Methods:
    static xf(a) @ L7764
  Statics:
    Lc.b = !0 @ L9646

## vc (L7774-7879)
  Fields:
    this.hd = window.performance.now()
    this.W = new bc
    this.Bd = this.Re = 0
    this.za = a
    this.l = new za(a.yc)
    this.Rh = window.setInterval(function() {
    this.te = new Fa(a)
    this.kj = window.setInterval(function() {
    this.Re = window.requestAnimationFrame(M(this, this.sf))
    this.hd = a, this.Bd++, this.Km(m.j.Rd.v()), 0 < this.za.Pd || this.l.
  Methods:
    constructor(a) @ L7775
    la() @ L7812
    sf() @ L7821
    Rc() @ L7826
    Fa(a) @ L7832
    switch(a.keyCode) @ L7835
    ld(a) @ L7869
    Km() @ L7872
  Statics:
    vc.b = !0 @ L9846

## Xb (L7880-7884)
  Methods:
    static h(a, b, c, d, e) @ L7881
  Statics:
    Xb.b = !0 @ L9799

## A (L7885-8051)
  Fields:
    this.s = a
    this.Ua = b
    this.a = 0
    this.s = new DataView(a)
    this.a = b
  Methods:
    constructor(a, b) @ L7886
    Vg() @ L7892
    Wb() @ L7898
    Qd() @ L7901
    ts() @ L7905
    uc(a) @ L7908
    Jr(a) @ L7911
    if(this.s.byteLength < a) @ L7913
    m(a) @ L7920
    nj(a) @ L7925
    Xb(a) @ L7931
    R(a) @ L7938
    tb(a) @ L7944
    mj(a) @ L7950
    u(a) @ L7956
    Lb(a) @ L7962
    Hs(a) @ L7968
    Yg(a) @ L7973
    oc(a) @ L7976
    Eb(a) @ L7980
    kn(a) @ L7983
    Zg(a) @ L7990
    oj(a) @ L7993
    pb(a) @ L8001
    static ka(a, b) @ L8010
    static bp(a, b, c) @ L8015
    static no(a) @ L8029
    static Dh(a) @ L8040
    static oo(a) @ L8047
  Statics:
    A.b = !0 @ L9655

## fb (L8052-8132)
  Fields:
    this.list = []
  Methods:
    constructor() @ L8053
    sn(a) @ L8056
    for(; e < f.length;) @ L8062
    if(h == c) @ L8067
    qt(a) @ L8076
    Qs(a, b) @ L8084
    rt(a) @ L8089
    for(; d < e;) @ L8094
    Rs(a) @ L8100
    static ht(a, b, c) @ L8107
    for(;;) @ L8117
    if(h.gb <= k.gb) @ L8120
  Statics:
    fb.b = !0 @ L9682

## oa extends W (L8172-8261)
  Fields:
    this.gj = new fb
    this.Ee = this.ec = 0
    this.we = new fb
    this.yc = this.dc = this.Ad = 0
    this.Ec = .06
    this.uh = 16.666666666666668
    this.Vf = 120
    this.ec = 0
    this.dc = this.Ec * a | 0
    this.Ad = this.Ec * (-200 > a ? -200 : 1E3 < a ? 1E3 : a)
  Methods:
    constructor(a) @ L8173
    Za(a) @ L8176
    ta() @ L8186
    hg() @ L8189
    A() @ L8192
    Sj(a) @ L8195
    for(; e < a;) @ L8200
    for(++e; c < d;) @ L8201
    for(; c < d;) @ L8214
    Pg(a) @ L8224
    Rk(a, b) @ L8227
    for(; f <= h;) @ L8240
    for(; d < e;) @ L8241
    Xr(a) @ L8253
    Gm(a) @ L8258
  Statics:
    oa.b = !0 @ L9715
    oa.ga = W @ L9716

## Ia extends oa (L8262-8550)
  Fields:
    this.Si = []
    this.Ei = []
    this.Hg = new fb
    this.jq = 1
    this.yd = this.Ym =
    this.fj = new gc(50)
    this.Gg = new gc(50)
    this.Rn = 500
    this.Ak = ""
    this.fi = b.At
    this.Xe = b.Ts
    this.sc = null)
    this.ua = null)
    this.Ak = null == a ? "Connection closed" : a
    this.yd = a, null != this.Id && this.Id(a))
    this.ed = window.performance.now() * this.Ec + this.fj.mh() - this.Y
    this.dc = 0), this.Rk(window.performance.now() * this.Ec + this.fj.mh(
    this.ed = 0)
    this.ed = this.Vf)
    this.yc = a.Sb()
    this.Y = a.kb()
    this.Ee = a.kb()
    this.ec = a.Bb()
    this.ed = 10
    this.fi = null
    this.Ym = a
    this.dc = 0)
  Methods:
    constructor(a, b) @ L8263
    Za(a, b) @ L8269
    switch(h.qb) @ L8321
    la(a) @ L8341
    If(a) @ L8348
    Ed() @ L8352
    A() @ L8355
    hg() @ L8360
    gk() @ L8363
    er(a) @ L8367
    br(a) @ L8391
    ar(a) @ L8402
    Ur(a) @ L8414
    Vb(a, b) @ L8423
    gn(a) @ L8427
    Yq(a) @ L8439
    fr(a) @ L8445
    gr(a) @ L8452
    am() @ L8461
    if(3 == this.yd) @ L8462
    for(var a = 0, b = this.Ei; a < b.length;) @ L8463
    for(var d = b.length; c < d;) @ L8472
    dr(a) @ L8490
    for(; d < e.length;) @ L8498
    Oi() @ L8507
    ta(a) @ L8523
    if(3 == this.yd) @ L8524
    static Ih(a) @ L8538
    switch(a.qb) @ L8539
  Statics:
    Ia.b = !0 @ L9754
    Ia.ga = oa @ L9755

## Zb extends oa (L8551-8840)
  Fields:
    this.ck = new Map
    this.Jb = null
    this.tg = 32
    this.We = new Map
    this.cc = []
    this.Od = 2
    this.vo = 600
    this.cq = a.Aj
    this.Fs = a.version
    this.eq = 1
    this.dl = this.yc = 0
    this.aj = window.performance.now()
    this.Oc = new qb(this.cq, a.iceServers, wc.channels, a.Mn)
    this.dc = 0)
    this.el = this.Y
    this.dl = this.Y
  Methods:
    constructor(a) @ L8552
    Za(a) @ L8558
    la() @ L8585
    for(; a < b.length;) @ L8589
    ap(a, b, c, d) @ L8596
    if(null != e) @ L8598
    if(d) @ L8599
    de() @ L8613
    Ui(a) @ L8617
    Ti(a) @ L8620
    ta(a) @ L8623
    A() @ L8632
    hg() @ L8638
    wp(a, b) @ L8642
    wq(a) @ L8657
    ni(a) @ L8678
    Il(a, b) @ L8684
    Ri() @ L8691
    Qg(a, b) @ L8701
    for(; c < d.length;) @ L8705
    Tr(a) @ L8711
    Sr() @ L8727
    if(0 != this.cc.length) @ L8729
    ir(a, b) @ L8738
    Zq(a, b) @ L8763
    Sk(a, b) @ L8786
    cr(a, b) @ L8793
    jr(a, b) @ L8802
    if(null != f) @ L8807
    if(e.Td.delay) @ L8820
  Statics:
    Zb.b = !0 @ L9759
    Zb.ga = oa @ L9760

## Ra extends p (L8926-8945)
  Fields:
    this.kh = 0 != a.F()
  Methods:
    constructor() @ L8927
    apply(a) @ L8930
    xa(a) @ L8934
    wa(a) @ L8937
    static qa(a) @ L8940
  Statics:
    Ra.b = !0 @ L9907
    Ra.ga = p @ L9908
    Ra.Aa = p.Ha({ @ L10313

## Jb extends p (L8946-8967)
  Fields:
    this.color = a.N()
    this.style = a.F()
    this.Ln = a.F()
  Methods:
    constructor() @ L8947
    apply(a) @ L8950
    xa(a) @ L8953
    wa(a) @ L8959
  Statics:
    Jb.b = !0 @ L9912
    Jb.ga = p @ L9913
    Jb.Aa = p.Ha({ @ L10321

## eb extends p (L8968-8986)
  Methods:
    constructor() @ L8969
    apply(a) @ L8972
    xa() @ L8984
    wa() @ L8985
  Statics:
    eb.b = !0 @ L9917
    eb.ga = p @ L9918
    eb.Aa = p.Ha({ @ L10329

## Aa extends p (L8987-9016)
  Fields:
    this.Gj = a.N()
    this.newValue = a.N()
  Methods:
    constructor() @ L8988
    apply(a) @ L8991
    xa(a) @ L9002
    wa(a) @ L9006
    static qa(a, b) @ L9010
  Statics:
    Aa.b = !0 @ L9922
    Aa.ga = p @ L9923
    Aa.Aa = p.Ha({ @ L10333

## Qa extends p (L9017-9042)
  Fields:
    this.Vd = a.N()
    this.jh = 0 != a.F()
  Methods:
    constructor() @ L9018
    apply(a) @ L9021
    xa(a) @ L9028
    wa(a) @ L9032
    static qa(a, b) @ L9036
  Statics:
    Qa.b = !0 @ L9927
    Qa.ga = p @ L9928
    Qa.Aa = p.Ha({ @ L10337

## Ma extends p (L9043-9063)
  Fields:
    this.ac = a.Ab()
    this.ac = ha.Xc(this.ac, 2))
  Methods:
    constructor() @ L9044
    apply(a) @ L9047
    xa(a) @ L9051
    wa(a) @ L9054
    static qa(a) @ L9058
  Statics:
    Ma.b = !0 @ L9932
    Ma.ga = p @ L9933
    Ma.Aa = p.Ha({ @ L10341

## fa extends p (L9064-9092)
  Fields:
    this.Vd = a.N()
    this.Bj = 1 == a ? u.ja : 2 == a ? u.Da : u.Pa
  Methods:
    constructor() @ L9065
    apply(a) @ L9068
    if(null != b) @ L9070
    xa(a) @ L9076
    wa(a) @ L9080
  Statics:
    fa.b = !0 @ L9937
    fa.ga = p @ L9938
    fa.Aa = p.Ha({ @ L10345

## Oa extends p (L9093-9119)
  Fields:
    this.Yd = q.na(new J(new DataView(a.buffer, a.byteOffset, a.byteLength
  Methods:
    constructor() @ L9094
    apply(a) @ L9097
    xa(a) @ L9103
    wa(a) @ L9110
    static qa(a) @ L9114
  Statics:
    Oa.b = !0 @ L9942
    Oa.ga = p @ L9943
    Oa.Aa = p.Ha({ @ L10349

## Za extends p (L9120-9138)
  Fields:
    this.fa = 1 == b ? u.ja : 2 == b ? u.Da : u.Pa
    this.eh = new xa
  Methods:
    constructor() @ L9121
    apply(a) @ L9124
    xa(a) @ L9128
    wa(a) @ L9132
  Statics:
    Za.b = !0 @ L9947
    Za.ga = p @ L9948
    Za.Aa = p.Ha({ @ L10361

## Pa extends p (L9139-9161)
  Fields:
    this.newValue = 0 != a.F()
  Methods:
    constructor() @ L9140
    apply(a) @ L9143
    xa(a) @ L9150
    wa(a) @ L9153
    static qa(a) @ L9156
  Statics:
    Pa.b = !0 @ L9952
    Pa.ga = p @ L9953
    Pa.Aa = p.Ha({ @ L10365

## Ha extends p (L9162-9198)
  Fields:
    this.Z = a.N()
    this.name = a.Ab()
    this.tj = a.Ab()
    this.Zb = a.Ab()
  Methods:
    constructor() @ L9163
    apply(a) @ L9166
    if(0 == this.P) @ L9167
    xa(a) @ L9178
    wa(a) @ L9184
    static qa(a, b, c, d) @ L9190
  Statics:
    Ha.b = !0 @ L9957
    Ha.ga = p @ L9958
    Ha.Aa = p.Ha({ @ L10369

## Lb extends p (L9199-9216)
  Fields:
    this.ac = a.Ab()
    this.Ke = a.N()
    this.ac = ha.Xc(this.ac, 2))
  Methods:
    constructor() @ L9200
    apply(a) @ L9203
    xa(a) @ L9207
    wa(a) @ L9211
  Statics:
    Lb.b = !0 @ L9962
    Lb.ga = p @ L9963
    Lb.Aa = p.Ha({ @ L10373

## db extends p (L9217-9238)
  Fields:
    this.Pf = 0 != a.F()
  Methods:
    constructor() @ L9218
    apply(a) @ L9221
    xa(a) @ L9232
    wa(a) @ L9235
  Statics:
    db.b = !0 @ L9967
    db.ga = p @ L9968
    db.Aa = p.Ha({}) @ L10377

## ab extends p (L9239-9261)
  Methods:
    constructor() @ L9240
    Cn(a) @ L9243
    if(null != a.Sq) @ L9244
    apply(a) @ L9250
    xa(a) @ L9254
    wa(a) @ L9257
  Statics:
    ab.b = !0 @ L9972
    ab.ga = p @ L9973
    ab.Aa = p.Ha({ @ L10378

## Ja extends p (L9262-9282)
  Fields:
    this.input = a.kb()
  Methods:
    constructor() @ L9263
    apply(a) @ L9266
    if(null != b) @ L9269
    xa(a) @ L9276
    wa(a) @ L9279
  Statics:
    Ja.b = !0 @ L9977
    Ja.ga = p @ L9978
    Ja.Aa = p.Ha({}) @ L10386

## Na extends p (L9283-9302)
  Fields:
    this.Hj = a.F()
  Methods:
    constructor() @ L9284
    apply(a) @ L9287
    xa(a) @ L9291
    wa(a) @ L9294
    static qa(a) @ L9297
  Statics:
    Na.b = !0 @ L9982
    Na.ga = p @ L9983
    Na.Aa = p.Ha({ @ L10387

## na extends p (L9303-9345)
  Fields:
    this.ah = !1
    this.qd = ha.Xc(this.qd, 100))
    this.Z = a.N()
    this.qd = a.Ab()
    this.ah = 0 != a.F()
  Methods:
    constructor() @ L9304
    Za() @ L9310
    apply(a) @ L9314
    if(null != b) @ L9318
    xa(a) @ L9326
    wa(a) @ L9332
    static qa(a, b, c) @ L9338
  Statics:
    na.b = !0 @ L9988
    na.ga = p @ L9989
    na.Aa = p.Ha({ @ L10391

## Kb extends p (L9346-9386)
  Fields:
    this.Bn = 0 != a.F()
    this.lh = []
  Methods:
    constructor() @ L9347
    apply(a) @ L9350
    if(0 == this.P) @ L9351
    for(var b = new Map, c = 0, d = a.K; c < d.length;) @ L9352
    for(e = this.lh; d < e.length;) @ L9360
    xa(a) @ L9372
    wa(a) @ L9379
  Statics:
    Kb.b = !0 @ L9993
    Kb.ga = p @ L9994
    Kb.Aa = p.Ha({ @ L10395

## Mb extends p (L9387-9440)
  Fields:
    this.Ke = a.N()
    this.tn = 0 != a.F()
    this.Na = []
    this.Yc = []
  Methods:
    constructor() @ L9388
    apply(a) @ L9391
    if(0 == this.P) @ L9392
    if(null != b) @ L9394
    if(this.tn) @ L9395
    xa(a) @ L9406
    for(var d = 1, e = 0, f = this.Na; e < f.length;) @ L9412
    wa(a) @ L9425
    for(var c = 0; 10 > c;) @ L9430
  Statics:
    Mb.b = !0 @ L9998
    Mb.ga = p @ L9999
    Mb.Aa = p.Ha({ @ L10399

## La extends p (L9441-9465)
  Fields:
    this.min = a.N()
    this.rate = a.N()
    this.rj = a.N()
  Methods:
    constructor() @ L9442
    apply(a) @ L9445
    xa(a) @ L9448
    wa(a) @ L9453
    static qa(a, b, c) @ L9458
  Statics:
    La.b = !0 @ L10003
    La.ga = p @ L10004
    La.Aa = p.Ha({ @ L10403

## bb extends p (L9466-9475)
  Methods:
    constructor() @ L9467
    apply(a) @ L9470
    xa() @ L9473
    wa() @ L9474
  Statics:
    bb.b = !0 @ L10008
    bb.ga = p @ L10009
    bb.Aa = p.Ha({ @ L10407

## cb extends p (L9476-9500)
  Methods:
    constructor() @ L9477
    apply(a) @ L9480
    if(null != a.M) @ L9483
    xa() @ L9498
    wa() @ L9499
  Statics:
    cb.b = !0 @ L10013
    cb.ga = p @ L10014
    cb.Aa = p.Ha({ @ L10411

## Ga extends p (L9501-9539)
  Fields:
    this.Ie = []
  Methods:
    constructor() @ L9502
    apply(a) @ L9505
    if(0 == this.P) @ L9506
    for(var b = 0, c = a.length; b < c;) @ L9508
    xa(a) @ L9515
    wa(a) @ L9521
    static qa(a) @ L9527
    for(; e < c.length;) @ L9532
  Statics:
    Ga.b = !0 @ L10018
    Ga.ga = p @ L10019
    Ga.Aa = p.Ha({ @ L10415

## v extends Error (L9540-9555)
  Fields:
    this.message = a
    this.Pj = null != c ? c : this
  Methods:
    constructor(a, b, c) @ L9541
    Fb() @ L9546
    static Mb(a) @ L9549
    static B(a) @ L9552
  Statics:
    v.b = !0 @ L10186
    v.ga = Error @ L10187

## Nb extends v (L9556-9564)
  Fields:
    this.value = a
  Methods:
    constructor(a, b, c) @ L9557
    Fb() @ L9561
  Statics:
    Nb.b = !0 @ L10191
    Nb.ga = v @ L10192
