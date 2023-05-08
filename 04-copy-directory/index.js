const path = require('path');
const fs = require('fs');
const filesOriginal = path.join(__dirname, 'files');
const filesCopy = path.join(__dirname, 'files-copy');

fs.readdir(filesOriginal, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  fs.mkdir(filesCopy, { recursive: true, force: true }, err => {
    if (err) throw err;
  });
  files.forEach(file => {
    fs.copyFile(path.join(filesOriginal, file.name), path.join(filesCopy, file.name), err => {
      if (err) throw err;
    });
  });
});

