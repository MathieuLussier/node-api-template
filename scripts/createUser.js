'use strict';

const bcrypt = require('bcrypt');

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

const User = require('../dist/models/user.model').default;
const Database = require('../dist/database').default;

async function main() {
  const username = process.argv[2].trim();
  const password = process.argv[3].trim();

  console.log(username, password);

  if (!username || !password) {
    console.error('Username and password is required');
    process.exit(1);
  }

  const connection = new Database().sequelize;

  await connection.authenticate();

  const hash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hash,
  });

  await user.save();

  await connection.close();

  process.exit(0);
}

main();
