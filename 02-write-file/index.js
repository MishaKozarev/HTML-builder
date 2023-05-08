const path = require('path');
const fs = require('fs');
const { stdin, stdout } = process;
const addFile = fs.createWriteStream(path.join(__dirname, 'file.txt'));
stdout.write('Enter text\n');
stdin.on('data', (chunk) => {
  let data = chunk.toString().trim();
  if(data === 'exit') {
    process.exit();
  } else {
    addFile.write(data);
    addFile.write('\n');
  }
});
process.on('exit', () => stdout.write('Process completed'));
process.on('SIGINT', () => {
  process.exit();
});
