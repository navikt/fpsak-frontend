const findImports = require('find-imports');
const path = require('path');
const fs = require('fs');
const os = require('os');
const targetDir = require('./config').targetDir;

const targetFiles = findImports(`${targetDir}/**/*.{js,jsx}`);
const outputFilePath = path.join(__dirname, 'imports.csv');

const allImports = [];
Object.keys(targetFiles)
  .forEach((filpath) => {
    const imports = targetFiles[filpath];
    imports.forEach((imported) => {
      if (!allImports[imported]) {
        allImports[imported] = 0;
      }
      allImports[imported] = allImports[imported] + 1;
    });
  });

const content = Object.keys(allImports)
  .join(os.EOL);
fs.writeFileSync(outputFilePath, content);
console.log(content);
