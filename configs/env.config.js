const dotenv = require('dotenv');
const path = require('path');

module.exports = function (environment = 'development') {
  const envFileName = `.env.${environment}`;
  dotenv.config({
    path: path.resolve(process.cwd(), envFileName),
  });
};
