const fs = require('fs');
const path = require('path');
const { stdout } = process;
const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
let a = '';
stream.on('data', chunk => a += chunk);
stream.on('end', () => stdout.write(a));
