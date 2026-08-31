// Ad/tracker blocking for the launcher.
//
// haxball.com/play loads a 160x600 skyscraper from cpmstar plus a swarm of
// ad-exchange / user-sync trackers (pubmatic, rubicon, doubleclick, amazon,
// adform, adsafeprotected, temu, ...). We block them at the network layer so
// nothing is ever fetched, then hide the empty ad column via CSS.

// Hostname suffixes to block. Matching is done on the request's hostname, so
// "cpmstar.com" also covers "server.cpmstar.com", "ssl.cdne.cpmstar.com", etc.
const BLOCKED_HOSTS = [
  'cpmstar.com',
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'adsafeprotected.com',
  'rubiconproject.com',
  'pubmatic.com',
  'adform.net',
  'amazon-adsystem.com',
  'deepintent.com',
  'a-mo.net',
  'fwmrm.net',
  'tracookiepixel.xyz',
  'adnxs.com',
  'adsrvr.org',
  'casalemedia.com',
  'criteo.com',
  'criteo.net',
  'moatads.com',
  'scorecardresearch.com',
  'temu.com',
  'bidswitch.net',
  'openx.net',
  'smartadserver.com',
  'yieldmo.com',
  '3lift.com',
  'sharethrough.com',
];

// Never block these, even if a rule above would otherwise match. Keeps the
// game, its API, our fonts, and Supabase working.
const ALLOWED_HOSTS = [
  'haxball.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'supabase.co',
];

function hostMatches(hostname, suffixes) {
  return suffixes.some(
    (s) => hostname === s || hostname.endsWith('.' + s)
  );
}

function isBlocked(url) {
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return false;
  }
  if (hostMatches(hostname, ALLOWED_HOSTS)) return false;
  return hostMatches(hostname, BLOCKED_HOSTS);
}

// CSS that removes the ad column so the game fills the width with no gap.
const HIDE_ADS_CSS = `
  .rightbar { display: none !important; }
  .container.flexRow > .flexCol.flexGrow { flex-grow: 1 !important; }
`;

/**
 * Register network-level ad blocking on a session and CSS hiding on a
 * webContents. Safe to call once at startup.
 */
function setupAdblock(session, webContents) {
  session.webRequest.onBeforeRequest((details, callback) => {
    callback({ cancel: isBlocked(details.url) });
  });

  const injectCss = () => {
    webContents.insertCSS(HIDE_ADS_CSS).catch(() => {});
  };
  webContents.on('dom-ready', injectCss);
}

module.exports = { setupAdblock, isBlocked, BLOCKED_HOSTS };
