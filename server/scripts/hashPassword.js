// Usage: npm run hash-password -- "your-password"
const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Provide a password: npm run hash-password -- "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nCopy this value into ADMIN_PASSWORD_HASH in server/.env:\n');
console.log(hash);
console.log();
