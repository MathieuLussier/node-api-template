import 'reflect-metadata';

import path from 'path';
import morgan from 'morgan';
import logger from '@utils/logger.util';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import cron from 'node-cron';
import express, { Application, Request, Response, NextFunction } from 'express';
import { errorConverter, errorHandler } from '@middlewares/error.middleware';

import { IndexController } from '@src/controllers/v1/index';

import { Api } from '@src/core/index';
import { ApiTask } from '@src/tasks/index';
import ApiError from './libs/apiError.lib';
import httpStatus from 'http-status';

export default class App {
  public app: Application = express();

  protected _routers = [new IndexController()];

  protected _tasks = [new ApiTask()];

  constructor() {
    this.init();
  }

  middleware(): void {
    const morganStream = {
      write: (message: string) =>
        logger.http(message.trim().replace(/"/g, "'")),
    };
    this.app.use(
      process.env.NODE_ENV === 'production'
        ? morgan('short', { stream: morganStream })
        : morgan('dev', { stream: morganStream })
    );
    this.app.use(express.static(path.join(__dirname, '..', '/public')));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());
  }

  routes(): void {
    for (const router of this._routers) {
      this.app.use(router.router);
    }
  }

  errorHandling(): void {
    this.app.use((_req: Request, res: Response, next: NextFunction) => {
      next(new ApiError('Not Found', httpStatus.NOT_FOUND));
    });

    this.app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        // const convertedError = errorConverter(err, _req, res);
        return errorHandler(err, _req, res);
      }
    );
  }

  initCore(): void {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    new Api();
  }

  initCron(): void {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    for (const task of this._tasks) {
      if (!task.cronTasks) {
        continue;
      }

      for (const cronTask of task.cronTasks) {
        const { schedule, method } = cronTask;

        cron.schedule(schedule, method.bind(task), {
          scheduled: true,
          timezone: 'America/Toronto',
        });
      }
    }
  }

  init(): void {
    this.app.set('trust proxy', true);
    this.middleware();
    this.routes();
    this.errorHandling();
    this.initCore();
    this.initCron();
  }
}
