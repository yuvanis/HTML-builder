const fs = require('fs');
const fsProm = require('fs/promises');
const path = require('path');
const dirPath = path.join(__dirname, 'assets');
const newDirPath = path.join(__dirname, 'project-dist', 'assets');
const stylesPath = path.join(__dirname, 'styles');
const newStylesPath = path.join(__dirname, 'project-dist', 'style.css');
const newIndexPath = path.join(__dirname, 'project-dist', 'index.html');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

fs.mkdir(newDirPath, { recursive: true }, err => {
  if (err) throw err;
  async function deleteFiles(newDirAssets) {
  const stat = await fsProm.stat(newDirAssets);
  if (stat.isDirectory()) {
  const files = await fsProm.readdir(newDirAssets);
  files.forEach(async (elem) => {
    await fsProm.unlink(newDirAssets + '/' + elem, function (err) {
      if (err)
        throw err;
    });
  });
}
}

fs.readdir(dirPath, function (err, files) {
  if (err) {
    throw err;
  } else {
    files.forEach(async(file) => {
      const dirAssets = path.join(__dirname, 'assets', file);
      const newDirAssets = path.join(__dirname, 'project-dist', 'assets', file);
      fs.mkdir(newDirAssets, { recursive: true }, err => {
        if (err) throw err;
      });
      await deleteFiles(newDirAssets)
      function copyFiles() {
        fs.readdir(dirAssets, function (err, elems) {
          if (err) {
            throw err;
          } else {
            elems.forEach((elem) => {
              fs.copyFile(dirAssets + '/' + elem, newDirAssets + '/' + elem, function (err) {
                if (err)
                  throw err;
              });
            });
          }
        });
      } 
      copyFiles()
    });
  }
});

const writeNewStyles = fs.createWriteStream(newStylesPath);

fs.readdir(stylesPath, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    fs.stat(stylesPath + "/" + file, (err, stats) => {
      if (err) throw err;
      if (stats.isFile() && path.extname(file) === '.css') {
        const readFile = fs.createReadStream(stylesPath + "/" + file, 'utf-8');
        readFile.on('data', (text) => {
          writeNewStyles.write(text.toString());
        });
      }
    });
  });
});

let writeNewIndex = fs.createWriteStream(newIndexPath);
let indexText = '';

fs.stat(templatePath, (err, stats) => {
  if (err) throw err;
  else {
    const readTemp = fs.createReadStream(templatePath, 'utf-8');
      readTemp.on('data', async (text) => {
        indexText = text.toString();
        let finalText = indexText;
        const components = await fsProm.readdir(componentsPath);
        const newComponents = components.map((e) => path.basename(e, path.extname(e)));
        for (let i = 0; i < components.length; i++) {
          const componentPath = componentsPath + '/' + components[i];
          const component = await fsProm.readFile(componentPath);
          finalText = finalText.replace(`{{${newComponents[i]}}}`, component);
          }
          writeNewIndex.write(finalText)
      });
  }
});
});