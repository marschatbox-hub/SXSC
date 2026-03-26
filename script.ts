import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (filepath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (filepath.endsWith('.tsx')) {
      callback(filepath);
    }
  }
}

walk('./src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  let modified = false;

  // Replace cyan shadows
  const cyanRegex = /shadow-\[.*?rgba\(0,232,252,.*?\).*?\]/g;
  if (cyanRegex.test(content)) {
    content = content.replace(cyanRegex, 'shadow-cyan');
    modified = true;
  }

  // Replace neon shadows
  const neonRegex = /shadow-\[.*?rgba\(0,255,171,.*?\).*?\]/g;
  if (neonRegex.test(content)) {
    content = content.replace(neonRegex, 'shadow-neon');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filepath, content, 'utf-8');
    console.log(`Updated ${filepath}`);
  }
});
