import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src', 'pages');

function replaceInFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content.replace(/dark:text-gray-\d00/g, '');
  newContent = newContent.replace(/dark:text-white/g, '');
  newContent = newContent.replace(/dark:hover:text-white/g, '');
  newContent = newContent.replace(/dark:hover:text-gray-\d00/g, '');
  
  // Clean up multiple spaces inside classNames
  newContent = newContent.replace(/className="([^"]+)"/g, (match, p1) => {
    return `className="${p1.replace(/\s+/g, ' ').trim()}"`;
  });
  
  // Clean up multiple spaces inside template literals for classNames
  newContent = newContent.replace(/className=\{`([^`]+)`\}/g, (match, p1) => {
    return `className={\`${p1.replace(/\s+/g, ' ').trim()}\`}`;
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(currentDir: string) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const filePath = path.join(currentDir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      replaceInFile(filePath);
    }
  }
}

walkDir(dir);

const componentsDir = path.join(process.cwd(), 'src', 'components');
if (fs.existsSync(componentsDir)) {
  walkDir(componentsDir);
}
