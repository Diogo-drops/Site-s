const fs = require('node:fs');
const path = require('node:path');
const env = fs.existsSync('.env') ? fs.readFileSync('.env', 'utf8') : '';
const url = process.env.DATABASE_URL || env.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m)?.[1];
if (url?.startsWith('file:')) {
  const file = path.resolve('prisma', url.slice(5));
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.closeSync(fs.openSync(file, 'a'));
}
