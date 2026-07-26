const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', '..', 'src', 'inject', 'bridge.js');
const OUTPUT = path.join(__dirname, '..', 'bridge.enc.js');

const source = fs.readFileSync(INPUT, 'utf8');

const result = JavaScriptObfuscator.obfuscate(source, {
  // High protection settings
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,  // Keep false — bridge uses game globals (T, Da, B, etc.)
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,

  // Don't rename reserved names that reference game internals
  reservedNames: [
    '^T$', '^Da$', '^B$', '^hax$', '__hax__',
    'prototype', 'Rc', 'sf', 'za', 'yc',
  ],
});

fs.writeFileSync(OUTPUT, result.getObfuscatedCode(), 'utf8');
console.log(`[Cipher] Bridge obfuscated: ${INPUT} -> ${OUTPUT}`);
console.log(`[Cipher] Original: ${source.length} bytes, Obfuscated: ${result.getObfuscatedCode().length} bytes`);
