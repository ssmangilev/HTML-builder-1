const fs = require('fs');
const path = require('path');

const folderName = 'secret-folder';
const pathToFolder = path.join(__dirname, folderName);
fs.readdir(path.join(pathToFolder), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
  }
  files.forEach((file) => {
    if (file.isFile()) {
      let fileResult = [];
      fileResult.push(file.name.slice(0, file.name.indexOf('.')));
      let pathToFile = path.join(pathToFolder, file.name);
      fileResult.push(path.extname(pathToFile).replace('.', ''));
      fs.stat(pathToFile, (err, stats) => {
        if (err) {
          console.error(err);
        }
        fileResult.push(`${Math.floor(stats.size / 1024)} Kb`);
        let result = fileResult.join(' - ');
        process.stdout.write(`${result}\n`);
      });
    }
  });
});
