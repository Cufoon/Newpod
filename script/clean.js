const fs = require('node:fs');
const path = require('node:path');

fs.rmSync(path.resolve(__dirname, '../build'), {
  recursive: true,
  force: true
});
