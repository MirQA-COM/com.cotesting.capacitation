const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'src', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const requiredTexts = [
  'Ingreso al sistema',
  'admin@demo.com',
  'Demo123!',
  'data-testid="user-email"'
];

const missingTexts = requiredTexts.filter((text) => !html.includes(text));

if (missingTexts.length > 0) {
  console.error('Validacion fallida. Faltan textos esperados:');
  for (const text of missingTexts) {
    console.error(`- ${text}`);
  }
  process.exit(1);
}

console.log('Validacion web OK');
