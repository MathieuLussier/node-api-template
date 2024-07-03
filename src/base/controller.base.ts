import { Router, Request, Response, NextFunction } from 'express';
import status from 'http-status';
import logger from '@utils/logger.util';

export interface IRoute {
  method: string;
  route: string;
  action: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[];
}

/**
 * @class BaseController
 * @description Base controller class to be extended by other controllers
 */
export default abstract class BaseController {
  protected _router = Router();
  private _routes: IRoute[];
  public baseRoute: string;
  protected status = status;
  protected logger = logger;

  constructor() {
    this._routes ||= [];
    this.baseRoute ||= `/${Object.getPrototypeOf(this).constructor.name.replace('Controller', '').toLowerCase()}`;

    for (const route of this.routes) {
      const formatRoute = (this.baseRoute + route.route).replace(/\/\//g, '/');

      const handlers = route.middlewares
        ? [...route.middlewares, route.action.bind(this)]
        : [route.action.bind(this)];
      (this._router as any)[route.method](formatRoute, ...handlers);
    }
  }

  get router() {
    return this._router;
  }

  get routes() {
    return this._routes;
  }
}
