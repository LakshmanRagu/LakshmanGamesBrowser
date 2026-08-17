const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

const styleRegex = /<style>([\s\S]*?)<\/style>/i;
const styleMatch = html.match(styleRegex);

const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
let scripts = [];
let match;
while ((match = scriptRegex.exec(html)) !== null) {
  scripts.push(match[1]);
}

if (styleMatch) {
  fs.writeFileSync('css/style.css', styleMatch[1].trim());
}

if (scripts.length > 0) {
  fs.writeFileSync('js/app.js', scripts.join('\n\n').trim());
}

let newHtml = html.replace(styleRegex, '<link rel="stylesheet" href="css/style.css">');
newHtml = newHtml.replace(/<script>[\s\S]*?<\/script>/g, '');
newHtml = newHtml.replace('</body>', '    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-tilt/1.8.1/vanilla-tilt.min.js"></script>\n    <script src="js/app.js"></script>\n</body>');

fs.writeFileSync('index.html', newHtml);
console.log('Done splitting!');
