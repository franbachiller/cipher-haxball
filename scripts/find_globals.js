// Find how the main app controller works, where the room state lives,
// and how input flows through the system
const fs = require('fs');
const code = fs.readFileSync('dump/game-beautified.js', 'utf8');
const lines = code.split('\n');

// Search for patterns
const patterns = [
  // Main controller / app entry
  /function\s*\w*\s*\(\s*\)\s*\{[^}]*onHBLoaded/,
  // Global room references  
  /\.T\b.*\.na\b/,
  // Where the active game view connects to room
  /GameView|gameView|game-view/i,
  // Input handling - keyboard
  /onkeydown|onkeyup|keyCode|event\.code/,
  // How player ID (yc) is used
  /\.yc\b/,
  // The main update loop / requestAnimationFrame
  /requestAnimationFrame|setInterval.*16/,
  // How da/Da class works (main controller)
  /class Da\b/,
  // How za (GameView) initializes
  /class za\b/,
  // Global variable assignments at the end
  /window\.\w+\s*=/,
];

patterns.forEach((pat, idx) => {
  console.log(`\n=== Pattern ${idx}: ${pat.source.substring(0, 60)} ===`);
  let count = 0;
  lines.forEach((line, i) => {
    if (pat.test(line) && count < 10) {
      console.log(`  L${i+1}: ${line.trim().substring(0, 200)}`);
      count++;
    }
  });
  if (count === 0) console.log('  (not found)');
});
