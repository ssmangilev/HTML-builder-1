const fs = require('fs');
const path = require('path');

const pathToCopy = path.join(__dirname, 'project-dist');
const pathToHtmlFolder = path.join(__dirname, 'components');
const dirName = 'assets';
const pathToOldAssets = path.join(__dirname, dirName);
const pathToCopyAssets = path.join(pathToCopy, `${dirName}`);

async function folderExists() {
  await fs.stat(pathToCopy, async (err) => {
    if (err) {
      await fs.mkdir(pathToCopy, () => {});
    } else {
      await fs.rmdir(pathToCopy, { recursive: true }, async () => {
        await fs.mkdir(pathToCopy, () => {});
      });
    }
  });
  return;
}

async function mergeHtml() {
  await folderExists();
  const templatesData = await getTemplatesObj(pathToHtmlFolder);
  let htmlData = await readFileData(path.join(__dirname, 'template.html'));
  for (let el in templatesData) {
    htmlData = htmlData.replace(new RegExp(`{{${el}}}`, 'g'), templatesData[el]['data']);
  }
  await writeFileData(path.join(pathToCopy, 'index.html'), htmlData);
  await mergeStyles();
  await folderAssetsExists();
}

async function getTemplatesObj(pathToHtmlFolder) {
  let files = await readDirData(pathToHtmlFolder);
  let templatesData = {};
  if (files) {
    files.forEach((file) => {
      if (path.extname(path.join(pathToHtmlFolder, file)) === '.html') {
        templatesData[file.slice(0, file.indexOf('.'))] = {
          path: path.join(pathToHtmlFolder, file),
        };
      }
    });
    for (let el in templatesData) {
      let fileData = await readFileData(templatesData[el]['path']);
      templatesData[el]['data'] = fileData;
    }
  }
  return templatesData;
}

function readFileData(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

function writeFileData(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });  
  });
}

function readDirData(path, withFileTypes) {
  return new Promise((resolve, reject) => {
    const withTypes = withFileTypes ? withFileTypes : false;
    fs.readdir(path, {withFileTypes: withTypes}, function (err, data) {
      if (data) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

async function mergeStyles() {
  const folderName = 'styles';
  const pathToFolder = path.join(__dirname, folderName);
  console.log(__dirname);
  const destPathToFolder = path.join(__dirname, 'project-dist');
  const bundleFileName = 'style.css';
  fs.readdir(path.join(pathToFolder), { withFileTypes: true }, (err, files) => {
    /* Get path to all .css files in a folder */
    if (err) {
      console.error(err);
    }
    let filesList = []; /*An array for save a path to .css files*/
    files.forEach((file) => {
      if (file.name === bundleFileName) {
        fs.unlink(path.join(pathToFolder, bundleFileName), (err) => {
          if (err !== 'null') {
            console.error(err);
          }
        });
      }
      let pathToFile = path.join(pathToFolder, file.name);
      if (path.extname(pathToFile).replace('.', '') === 'css') {
        filesList.push(pathToFile);
      }
    });

    filesList.forEach((file) => {
      let ws = fs.createWriteStream(
        path.join(destPathToFolder, bundleFileName),
        { encoding: 'utf8', flags: 'a' }
      ); /* Create a writestream for a bundle file */
      let rs = fs.createReadStream(file, {
        encoding: 'utf8',
      }); /*Create a readstream for reading a data from old-files */
      rs.pipe(ws); /* Create pipe for reading and writing */
    });
    console.log('SUCCESS');
  });
}

async function folderAssetsExists() {
  await fs.stat(pathToCopyAssets, async (err) => {
    if (err) {
      await fs.mkdir(pathToCopyAssets, () => {});
      await copyFiles(pathToOldAssets, pathToCopyAssets);
    } else {
      await fs.rmdir(pathToCopyAssets, { recursive: true }, async () => {
        await fs.mkdir(pathToCopyAssets, () => {});
        await copyFiles(pathToOldAssets, pathToCopyAssets);
      });
    }
  });
  return;
}

async function copyFiles(src, dest) {
  await fs.mkdir(dest, {recursive: true}, () => {});
  let files = await readDirData(src, true);
  files.forEach( async (file) => {
    let srcPath = path.join(src, file.name);
    let destPath = path.join(dest, file.name);
    if (file.isDirectory()) {
      await copyFiles(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath, () => {});
    }
  });
}




mergeHtml();

