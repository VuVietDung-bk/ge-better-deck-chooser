const fs = require('fs');
const path = require('path');

const { bootstrap } = require(path.join('..', 'server.js'));
const outputDir = path.join(__dirname, '..', 'public');
const outputPath = path.join(outputDir, 'bootstrap.json');
const imagesSource = path.join(__dirname, '..', 'images');
const imagesDest = path.join(outputDir, 'images');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(bootstrap));
console.log(`Wrote ${outputPath}`);

if (fs.existsSync(imagesSource)) {
  if (fs.existsSync(imagesDest)) {
    fs.rmSync(imagesDest, { recursive: true, force: true });
  }
  copyDir(imagesSource, imagesDest);
  console.log(`Copied images to ${imagesDest}`);
}

function copyDir(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
