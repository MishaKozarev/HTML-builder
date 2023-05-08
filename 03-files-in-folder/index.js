const path = require('path');
const fs = require('fs');
const folder = path.join(__dirname, 'secret-folder');

fs.readdir(folder, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    if (file.isFile()) {
      const pathFile = path.join(folder, file.name);
      fs.stat(pathFile, (err, stats) => {
        if (err) throw err;
        const currentFile = file.name.split('.');
        const currentFileName = currentFile[0];
        const currentFileExtension = currentFile[1];
        const currentFileWeight = Math.round(stats.size / 1024 * 1000) / 1000;
        console.log(`${currentFileName} - ${currentFileExtension} - ${currentFileWeight}kB`);
      });
    }
  });
});
