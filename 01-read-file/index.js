const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const readFile = fs.createReadStream(pathToFile, 'utf-8');

readFile.on('data', (text) => {
  process.stdout.write(text.toString());
});