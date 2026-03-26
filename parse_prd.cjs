const fs = require('fs');
const html = fs.readFileSync('./prd.html', 'utf8');
const text = html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
fs.writeFileSync('./prd.txt', text);
