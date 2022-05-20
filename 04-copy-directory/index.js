
const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

fs.mkdir(newDirPath, { recursive: true }, err => {
  if (err) throw err;
  async function deleteFiles(newDirPath) {
    const stat = await fsProm.stat(newDirPath);
    if (stat.isDirectory()) {
      const files = await fsProm.readdir(newDirPath);
      files.forEach(async (elem) => {
        await fsProm.unlink(newDirPath + '/' + elem, function (err) {
          if (err)
            throw err;
        });
      });
    }
  }

  fs.readdir(dirPath, async function (err, files) {
    if (err) {
      throw err;
    } else {
        await deleteFiles(newDirPath)
        function copyFiles() {
          fs.readdir(dirPath, function (err, elems) {
            if (err) {
              throw err;
            } else {
              elems.forEach((elem) => {
                fs.copyFile(dirPath + '/' + elem, newDirPath + '/' + elem, function (err) {
                  if (err)
                    throw err;
                });
              });
            }
          });
        }
        copyFiles();
    }
  });
});