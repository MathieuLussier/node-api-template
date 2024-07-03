import { Sequelize } from 'sequelize-typescript';
import logger from './utils/logger.util';

interface DatabaseConfig {
  development: {
    username: string;
    password: string | undefined;
    database: string;
    host: string;
    dialect: string;
  };
  test: {
    username: string;
    password: string | undefined;
    database: string;
    host: string;
    dialect: string;
  };
  production: {
    username: string;
    password: string | undefined;
    database: string;
    host: string;
    dialect: string;
  };
  [key: string]: {
    username: string;
    password: string | undefined;
    database: string;
    host: string;
    dialect: string;
  };
}

const config: DatabaseConfig = require('../configs/database.json');
const node_env = process.env.NODE_ENV || 'development';
const envConfig = config[node_env];

const sequelizeOptions: any & { dialect: any } = {
  ...envConfig,
  models: [__dirname + '/models/**/*.model.*'],
  logging: (msg) => logger.debug(msg),
  dialect: envConfig.dialect,
  define: {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  },
};

export default class Database {
  private _sequelize: Sequelize;

  constructor() {
    this._sequelize = new Sequelize(sequelizeOptions);
  }

  get sequelize(): Sequelize {
    return this._sequelize;
  }
}
