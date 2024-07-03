import fs from 'fs';
import path from 'path';
import { createLogger, transports, format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

function filterOnly(level: string) {
  return format((info) => {
    if (info.level === level) {
      return info;
    }
    return false;
  })();
}

function excludeLevels(levels: string[]) {
  return format((info) => {
    if (levels.includes(info.level)) {
      return false;
    }
    return info;
  })();
}

const logDirectory = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const dailyRotateTransport = new DailyRotateFile({
  filename: `${logDirectory}/%DATE%/logs-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    excludeLevels(['http', 'error']),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

const httpRotateTransport = new DailyRotateFile({
  level: 'http',
  filename: `${logDirectory}/%DATE%/http-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    filterOnly('http'),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

const errorDailyRotateTransport = new DailyRotateFile({
  level: 'error',
  filename: `${logDirectory}/%DATE%/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  format: format.combine(
    filterOnly('error'),
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  silent: process.env.NODE_ENV === 'test',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message }) => `${level} ${message}`)
      ),
    }),
    errorDailyRotateTransport,
    httpRotateTransport,
    dailyRotateTransport,
  ],
});

export default logger;
