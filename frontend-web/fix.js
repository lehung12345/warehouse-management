const fs = require('fs');
const path = require('path');
const dir = 'src/pages/admin';
function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content.replace(/borderCollapse:\s*[\"']collapse[\"'](?!\s*as)/g, 'borderCollapse: "collapse" as any');
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', filePath);
  }
}
fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.tsx')) {
    replaceInFile(path.join(dir, file));
  }
});
console.log('Done');
