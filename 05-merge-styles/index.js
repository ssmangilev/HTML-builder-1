const fs = require('fs');
const path = require('path');
function mergeStyles() {
  const folderName = 'styles';
  const pathToFolder = path.join(__dirname, folderName);
  console.log(__dirname);
  const destPathToFolder = path.join(__dirname, 'project-dist');
  const bundleFileName = 'bundle.css';
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

mergeStyles();

module.exports = mergeStyles;
