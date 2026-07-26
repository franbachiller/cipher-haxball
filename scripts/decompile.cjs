// Full structural analysis of game-min.js (beautified)
// Extracts every class with its constructor fields, methods, static fields,
// inheritance, and string templates.

const fs = require('fs');
const code = fs.readFileSync('dump/game-beautified.js', 'utf8');
const lines = code.split('\n');

const output = [];

// Find all classes
const classes = [];
let currentClass = null;
let braceDepth = 0;
let classStartLine = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const trimmed = line.trim();

  // Detect class declaration
  const classMatch = trimmed.match(/^class\s+(\w+)(\s+extends\s+(\w+))?\s*\{/);
  if (classMatch) {
    currentClass = {
      name: classMatch[1],
      extends: classMatch[3] || null,
      line: i + 1,
      constructorFields: [],
      methods: [],
      staticFields: [],
      endLine: 0,
    };
    classes.push(currentClass);
    classStartLine = i;
    braceDepth = 0;
    // Count braces on this line
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    continue;
  }

  if (currentClass) {
    for (const ch of line) {
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }

    // Detect methods (at depth 1 inside class)
    const methodMatch = trimmed.match(/^(\w+)\s*\(([^)]*)\)\s*\{/);
    if (methodMatch && braceDepth >= 1) {
      currentClass.methods.push({
        name: methodMatch[1],
        args: methodMatch[2],
        line: i + 1,
      });
    }

    // Detect static methods
    const staticMatch = trimmed.match(/^static\s+(\w+)\s*\(([^)]*)\)\s*\{/);
    if (staticMatch) {
      currentClass.methods.push({
        name: 'static ' + staticMatch[1],
        args: staticMatch[2],
        line: i + 1,
      });
    }

    // Detect constructor `this.X = ` assignments
    if (currentClass.methods.length > 0 && currentClass.methods[0].name === 'constructor') {
      const thisMatch = trimmed.match(/this\.(\w+)\s*=/);
      if (thisMatch && braceDepth >= 2) {
        const field = thisMatch[1];
        if (!currentClass.constructorFields.includes(field)) {
          // Try to get the initial value
          const valMatch = trimmed.match(/this\.\w+\s*=\s*(.+?)(?:;|$)/);
          const val = valMatch ? valMatch[1].substring(0, 60) : '?';
          currentClass.constructorFields.push(field + ' = ' + val);
        }
      }
    }

    if (braceDepth <= 0) {
      currentClass.endLine = i + 1;
      currentClass = null;
    }
  }
}

// Find static assignments after class definitions (e.g. Ra.Aa = ...)
const staticAssignments = new Map();
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].trim().match(/^(\w+)\.(\w+)\s*=\s*(.+?)(?:;|$)/);
  if (m) {
    const cls = m[1], prop = m[2], val = m[3].substring(0, 80);
    if (!staticAssignments.has(cls)) staticAssignments.set(cls, []);
    staticAssignments.get(cls).push({ prop, val, line: i + 1 });
  }
}

// Find HTML templates (X.O = "...")
const templates = new Map();
for (let i = 0; i < lines.length; i++) {
  const m = lines[i].trim().match(/^(\w+)\.O\s*=\s*["'`](.{0,80})/);
  if (m) {
    templates.set(m[1], { preview: m[2], line: i + 1 });
  }
}

// Generate output
output.push('# HaxBall game-min.js — Full Class Map');
output.push('# Generated from beautified source (' + lines.length + ' lines)');
output.push('# ' + classes.length + ' classes found\n');

for (const cls of classes) {
  let header = `## ${cls.name}`;
  if (cls.extends) header += ` extends ${cls.extends}`;
  header += ` (L${cls.line}-${cls.endLine})`;
  output.push(header);

  if (cls.constructorFields.length > 0) {
    output.push('  Fields:');
    for (const f of cls.constructorFields) {
      output.push('    this.' + f);
    }
  }

  if (cls.methods.length > 0) {
    output.push('  Methods:');
    for (const m of cls.methods) {
      output.push(`    ${m.name}(${m.args}) @ L${m.line}`);
    }
  }

  // Static assignments
  const statics = staticAssignments.get(cls.name);
  if (statics && statics.length > 0) {
    output.push('  Statics:');
    for (const s of statics) {
      output.push(`    ${cls.name}.${s.prop} = ${s.val} @ L${s.line}`);
    }
  }

  // Template
  const tmpl = templates.get(cls.name);
  if (tmpl) {
    output.push(`  Template: ${tmpl.preview}... @ L${tmpl.line}`);
  }

  output.push('');
}

// Write
fs.writeFileSync('docs/CLASS_MAP.md', output.join('\n'));
console.log('Written to docs/CLASS_MAP.md — ' + classes.length + ' classes');
