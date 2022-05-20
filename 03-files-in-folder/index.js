const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const pathToFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathToFile, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.stat(pathToFile + "/" + file, (err, stats) => {
      if (err) throw err;
      if (stats.isFile()) {
        const extName = path.extname(file);
        stdout.write(`${path.basename(file, extName)} - ${extName.slice(1)} - ${(stats.size / 1024).toFixed(3)}kb\n`);
      }
    });
  });
});