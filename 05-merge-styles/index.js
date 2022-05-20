const fs = require('fs');
const path = require('path');
const stylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(__dirname, 'project-dist', 'bundle.css');

const writeBundle = fs.createWriteStream(bundlePath);

fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.stat(stylesPath + "/" + file, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(file) === '.css') {
        const readFile = fs.createReadStream(stylesPath + "/" + file, 'utf-8')
        readFile.on('data', (text) => {
          writeBundle.write(text.toString());
        });
      }
    });
  });
});