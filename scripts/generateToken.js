'use strict';

const jwt = require('jsonwebtoken');
const fs = require('fs');

let env = 'development';
for (const [index, arg] of process.argv.entries()) {
  if (arg === '--env') {
    const e = process.argv[index + 1];
    if (e === 'development' || e === 'production' || e === 'test') {
      env = e;
    } else {
      console.error('Invalid environment');
      process.exit(1);
    }
    break;
  }
}
require('../configs/env.config')(env);

async function main() {
  const secret = process.env.JWT_TOKEN_SECRET;

  const token = await jwt.sign({ use: 'pandrive' }, secret, {
    expiresIn: 86400, // expires in 24 hours
  });

  if (!fs.existsSync('tmp')) {
    fs.mkdirSync('tmp');
  }

  fs.writeFileSync('tmp/token.txt', token);

  console.log(token);

  process.exit(0);
}

main();
