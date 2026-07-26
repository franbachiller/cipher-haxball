const fs = require('fs');
const buf = fs.readFileSync('dump/www.haxball.com/rs/api/list');
console.log('Size:', buf.length);
console.log('First 40 bytes (hex):', buf.subarray(0, 40).toString('hex'));
console.log('First byte:', buf[0]);
// Try parsing as binary room list (HaxBall format)
console.log('First 100 bytes as ascii (lossy):', buf.subarray(0, 100).toString('latin1'));
