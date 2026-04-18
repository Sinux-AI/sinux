const fs = require('fs');
const path = require('path');

const directory = './src';

const replacements = [
  { regex: /\btext-white(?=\/|\b|\s|")/g, replace: 'text-text-primary' },
  { regex: /\bbg-black(?=\/|\b|\s|")/g, replace: 'bg-surface-raised' },
  { regex: /\bbg-\[\#030305\]/g, replace: 'bg-background' },
  { regex: /\bbg-\[\#08080d\]/g, replace: 'bg-background' },
  { regex: /\bh-screen bg-black/g, replace: 'h-screen bg-background' },
  { regex: /\bborder-white\/([0-9]+)/g, replace: 'border-border-glow' }, 
  { regex: /\bbg-white\/([0-9]+)/g, replace: 'bg-text-primary/10' }
];

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(filePath));
    } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
      files.push(filePath);
    }
  }
  return files;
}

const files = walk(directory);
let updatedFilesCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const { regex, replace } of replacements) {
    content = content.replace(regex, replace);
  }
  
  if (original !== content) {
    fs.writeFileSync(file, content, 'utf8');
    updatedFilesCount++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Done! Updated ${updatedFilesCount} files.`);
