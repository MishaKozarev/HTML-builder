const path = require('path');
const fs = require('fs');
const styles = path.join(__dirname, 'styles');
const assets = path.join(__dirname, 'assets');
const template = path.join(__dirname, 'template.html');
const projectDist = path.join(__dirname, 'project-dist');
const projectDistStyle = path.join(__dirname, '/project-dist', 'style.css');
const projectDistAssets = path.join(__dirname, 'project-dist', 'assets');
const projectDistIndex = path.join(__dirname, 'project-dist', 'index.html');
let arrStyles = [];

// Creat folder projectDist
fs.mkdir(projectDist, { recursive: true, force: true }, err => {
  if (err) throw err;
});

// Creat folder projectDist/assets
fs.mkdir(projectDistAssets, { recursive: true, force: true }, err => {
  if (err) throw err;
});

// Recursive function copy files from assets to projectDist/assets
function copyFolder (folder, folderNew) {
  fs.readdir(folder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach(file => {
      let assetsFile = path.join(folder, file.name);
      let projectDistAssetsFile = path.join(folderNew, file.name);
      if (file.isDirectory()) {
        fs.mkdir(projectDistAssetsFile, { recursive: true, force: true }, err => {
          if (err) throw err;
        });
        copyFolder(assetsFile, projectDistAssetsFile);
      }
      if (file.isFile()) {
        fs.copyFile(assetsFile, projectDistAssetsFile, (err) => {
          if (err) throw err;
        });
      }
    });
  });
}
copyFolder (assets, projectDistAssets);

// Add folder style and copy files from style to projectDist/style
const copyStyle = fs.createWriteStream(projectDistStyle, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readdir(styles, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  files.forEach(file => {
    const currentFile = path.join(__dirname, 'styles', file.name);
    if (file.isFile()) {
      if(path.extname(currentFile)==='.css'){
        let currentStream = fs.createReadStream(currentFile, 'utf8');
        currentStream.on('error', err => {
          if (err) throw err;
        });
        currentStream.on('data', (chunk) => {
          arrStyles.push(chunk);
        });
        currentStream.on('end', () => {
          copyStyle.write(arrStyles.pop().trim());
        });
      }
    }
  });
});

// Add html
fs.copyFile(template, projectDistIndex, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readFile(template, 'utf-8', (err, data) => {
  if (err) console.log(err);
  let templateHtml = data;
  const templateTags = data.match(/{{[a-z]*}}/gi);
  for (let tag of templateTags) {
    const tagName = tag.slice(2, -2);
    const componentFileName = path.join(__dirname, 'components', `${tagName}.html`);
    fs.readFile(componentFileName, 'utf-8', (err, dataFile) => {
      if (err) console.error(err);
      templateHtml = templateHtml.replace(tag, dataFile);
      fs.rm(projectDistIndex, { recursive: true, force: true }, (err) => {
        if (err) {
          return console.error(err);
        }
        const index = fs.createWriteStream(projectDistIndex);
        index.write(templateHtml);
      });
    });
  }
});