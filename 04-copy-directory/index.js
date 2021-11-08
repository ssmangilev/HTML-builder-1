const fs = require('fs');
const path = require('path');

const dirName = 'files';
const pathToOldFolder = path.join(__dirname, dirName);
const pathToCopy = path.join(__dirname, `${dirName}-copy`);

async function copyDir(pathToOldFolder, pathToCopy) {
  await fs.readdir(pathToOldFolder, (err, files) => {
    if (!err) {
      files.forEach(async (file) => {
        await fs.copyFile(`${pathToOldFolder}/${file}`, `${pathToCopy}/${file}`, () => {});
      });
    }
  });
}

async function folderExists() {
  await fs.stat(pathToCopy, async (err) => {
    if (err) {
      await fs.mkdir(pathToCopy, () => {});
      await copyDir(pathToOldFolder, pathToCopy);
    } else {
      await fs.rmdir(pathToCopy, {recursive: true}, async () => {
        await fs.mkdir(pathToCopy, () => {});
        await copyDir(pathToOldFolder, pathToCopy);
      }); 
    } 
  });
  return;
}


folderExists();
