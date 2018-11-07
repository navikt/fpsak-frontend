const path = require('path');
const fs = require('fs');
const similarity = require('similarity');
const recursiveSearch = require('recursive-search');
const sourceDir = require('./config').sourceDir;
const targetDir = require('./config').targetDir;

const sourceFiles = recursiveSearch.recursiveSearchSync('*', sourceDir);
const candidates = [];
const filesThatExistsInTarget = [];
const newFilesInSource = [];
sourceFiles.forEach((filename) => {
  const basename = path.basename(filename);
  if (!candidates[basename]) {
    candidates[basename] = [];
  }
  candidates[basename].push(filename);
});
const targetFiles = recursiveSearch.recursiveSearchSync(/.+\..+$/, targetDir, { all: false });
const overWrites = [];
targetFiles.forEach((targetFilePath) => {
  if (targetFilePath.indexOf('/node_modules/') === -1 && targetFilePath.indexOf('/dist/') === -1 && targetFilePath.indexOf('/cypress/') === -1) {
    const basename = path.basename(targetFilePath);
    filesThatExistsInTarget[basename] = true;
    if (!candidates[basename]) {
      console.log('Not found', targetFilePath);
    } else if (candidates[basename].length === 1) {
      // console.log('Perfect match', candidates[basename][0])
      overWrites[targetFilePath] = candidates[basename][0];
    } else {
      // console.log(filename, candidates[basename])
      const closestFile = findClosestMatch(targetFilePath, candidates[basename]);
      overWrites[closestFile] = candidates[basename][0];
    }
  }
});
console.log('Number of overwrites:', Object.keys(overWrites).length);

Object.keys(candidates).forEach((basename) => {
  if (!filesThatExistsInTarget[basename]) {
    console.log(candidates[basename][0]);
    newFilesInSource.push(candidates[basename][0]);
  }
});
console.log(newFilesInSource);

function findClosestMatch(targetFilePath, candidateFiles) {
  const targetFileContent = fs.readFileSync(targetFilePath).toString();
  let currentMax = 0;
  let currentMaxFile = null;
  candidateFiles.forEach((sourceFilePath) => {
    const sourceFileContent = fs.readFileSync(sourceFilePath).toString();
    const thisSim = similarity(targetFileContent, sourceFileContent);
    if (thisSim > currentMax) {
      currentMax = thisSim;
      currentMaxFile = sourceFilePath;
    }
  });
  return currentMaxFile;
}

function cleanPaths(sourceFilePath, targetFilePath) {
  const nicesource = sourceFilePath.replace(sourceDir, '');
  const nicetarget = targetFilePath.replace(targetDir, '');
  return `${nicesource} => ${nicetarget}`;
}

function doOverWrites(overWritesFiles) {
  Object.keys(overWritesFiles).forEach((targetFilePath) => {
    const sourceFilePath = overWritesFiles[targetFilePath];
    const targetFileContent = fs.readFileSync(targetFilePath).toString();
    const sourceFileContent = fs.readFileSync(sourceFilePath).toString();
    const simIndex = similarity(targetFileContent, sourceFileContent);
    if (simIndex > 0.4) {
      fs.writeFileSync(targetFilePath, sourceFileContent);
    } else {
      console.warn(`Not similar enough(${simIndex})`, cleanPaths(sourceFilePath, targetFilePath));
    }
  });
}
