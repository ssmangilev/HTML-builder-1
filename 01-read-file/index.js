const fs = require('fs');
const path = require('path');
const file_name = 'text.txt'; 

let file_path = path.join(__dirname, file_name);
let readStream = new fs.createReadStream(file_path, 'utf8');
readStream.on('data', function(chunk) {
  process.stdout.write(chunk);
});


