const fs = require('fs');
try {
  const pkg = require('./node_modules/docx/package.json');
  fs.writeFileSync('docx_version.txt', JSON.stringify(pkg.version));
} catch (e) {
  fs.writeFileSync('docx_version.txt', 'Error: ' + e.message);
}
