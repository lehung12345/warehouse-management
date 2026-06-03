const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/pages');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Hardcoded whites and light grays become --text-primary
  content = content.replace(/'#FFF'/g, "'var(--text-primary)'")
                   .replace(/"#FFF"/g, '"var(--text-primary)"')
                   .replace(/'#fff'/g, "'var(--text-primary)'")
                   .replace(/"#fff"/g, '"var(--text-primary)"')
                   .replace(/'#F3F4F6'/g, "'var(--text-primary)'")
                   .replace(/"#F3F4F6"/g, '"var(--text-primary)"')
                   .replace(/'#D1D5DB'/g, "'var(--text-primary)'")
                   .replace(/"#D1D5DB"/g, '"var(--text-primary)"');
  
  // Muted grays become --text-secondary
  content = content.replace(/'#9CA3AF'/g, "'var(--text-secondary)'")
                   .replace(/"#9CA3AF"/g, '"var(--text-secondary)"')
                   .replace(/'#6B7280'/g, "'var(--text-secondary)'")
                   .replace(/"#6B7280"/g, '"var(--text-secondary)"')
                   .replace(/'#8891A4'/g, "'var(--text-secondary)'")
                   .replace(/"#8891A4"/g, '"var(--text-secondary)"');
  
  // Replace rgba borders for charts and lines
  content = content.replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.05\s*\)/g, 'var(--border)')
                   .replace(/rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*0\.1\s*\)/g, 'var(--border)');
                   
  // Specific Chart.js color property
  content = content.replace(/color:\s*['"]#fff['"]/g, "color: 'var(--text-primary)'")
                   .replace(/color:\s*['"]rgba\(255, 255, 255, 0.1\)['"]/g, "color: 'var(--border)'")
                   .replace(/color:\s*['"]rgba\(255, 255, 255, 0.05\)['"]/g, "color: 'var(--border)'");
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
console.log('Color cleanup complete.');
