const fs = require('fs');
const path = require('path');
const readline = require('readline');
const fileName = 'text.txt';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
rl.question('Please enter a text here: ', () => {
  let writeStream = fs.createWriteStream(path.join(__dirname, fileName), {
    encoding: 'utf8',
    flags: 'a',
  });
  rl.on('line', (line) => {
    if (line === 'exit') {
      rl.close();
      process.exit();
    } else {
      writeStream.write(line);
    }
  });
});
