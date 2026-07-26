const fs = require('fs');
const lines = fs.readFileSync('dump/game-beautified.js', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.match(/^\s*class\s/)) console.log((i + 1) + ': ' + l.trim());
});
