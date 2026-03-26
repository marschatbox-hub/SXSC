import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'src', 'pages');

function replaceInFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content.replace(/dark:text-gray-200/g, 'dark:text-gray-800');
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
