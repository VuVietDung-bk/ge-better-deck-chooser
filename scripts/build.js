const fs = require('fs');
const path = require('path');

const { bootstrap } = require(path.join('..', 'server.js'));
const outputDir = path.join(__dirname, '..', 'public');
const outputPath = path.join(outputDir, 'bootstrap.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(bootstrap));
console.log(`Wrote ${outputPath}`);
