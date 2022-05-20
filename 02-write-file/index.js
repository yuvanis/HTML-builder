const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdout } = require('process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const pathToFile = path.join(__dirname, 'text.txt');
const writeFile = fs.createWriteStream(pathToFile);

stdout.write('Welcome! Please enter text:\n');

rl.addListener('line', (input) => {
  if (input === 'exit') {
    stdout.write('Good bye!\n');
    process.exit(0);
  } else {
    writeFile.write(`${input}\n`);
  }
});

rl.addListener('close', () => {
  stdout.write('Good bye!\n');
  process.exit(0);
});