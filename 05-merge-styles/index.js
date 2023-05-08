const path = require('path');
const fs = require('fs');
const pathStyle = path.join(__dirname, 'styles');
const fileStyle = path.join(__dirname, '/project-dist', 'bundle.css');
let arrStyles = [];

const bundle = fs.createWriteStream(fileStyle, (err) => {
  if (err) {
    return console.error(err);
  }
});

fs.readdir(pathStyle, { withFileTypes: true }, (err, files) => {
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
          bundle.write(arrStyles.pop().trim());
        });
      }
    }
  });
});
