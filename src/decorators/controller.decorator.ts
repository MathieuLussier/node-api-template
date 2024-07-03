import { Request, Response, NextFunction } from 'express';

function action(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
  method: string,
  route: string,
  middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[]
) {
  if (!target._routes) {
    target._routes = [];
  }
  target._routes.push({
    method,
    route,
    action: target[propertyKey],
    middlewares,
  });
}

function createRouteDecorator(method: string) {
  return (
    route: string,
    middlewares?: ((req: Request, res: Response, next: NextFunction) => void)[]
  ) => {
    return (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) => {
      action(target, propertyKey, descriptor, method, route, middlewares);
    };
  };
}

export const Get = createRouteDecorator('get');
export const Post = createRouteDecorator('post');
export const Put = createRouteDecorator('put');
export const Delete = createRouteDecorator('delete');

export function Controller(baseRoute: string) {
  return (target: any) => {
    target.prototype.baseRoute = baseRoute;
  };
}
