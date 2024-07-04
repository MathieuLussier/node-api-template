import { Request, Response, NextFunction } from 'express';
import ApiError from '@src/libs/apiError.lib';
import { verify } from 'jsonwebtoken';
import logger from '@src/utils/logger.util';
import httpStatus from 'http-status';
import { User } from '@src/models';
import UserService from '@src/services/user.service';

import { validate, Joi } from 'express-validation';

export const validateLoginRequest = validate(
  {
    body: Joi.object({
      username: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
  {
    keyByField: true,
  },
  {}
);

export const checkApiToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers['x-api-key'] || req.headers['authorization'];
  // if token is in the authorization header, we need to extract it
  if (token && token.toString().startsWith('Bearer ')) {
    token = token.toString().replace('Bearer ', '');
  }
  const secretKey = process.env.JWT_TOKEN_SECRET || '';

  if (!token) {
    next(
      new ApiError('Token missing in header x-api-key', httpStatus.FORBIDDEN)
    );
    return;
  }

  try {
    await verify(token as string, secretKey);
  } catch (error) {
    logger.debug('Error in checkApiToken', error);
    next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
    return;
  }

  next();
};

export const basicAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = req.headers.authorization;

  if (!auth) {
    next(new ApiError('Forbidden', httpStatus.FORBIDDEN));
    return;
  }

  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64')
    .toString()
    .split(':');

  const foundUser = (await UserService.getInstance().getUserByUsername(
    username
  )) as User;

  if (!foundUser) {
    next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
    return;
  }

  const isPasswordValid = await foundUser.comparePassword(password);

  if (!isPasswordValid) {
    next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
    return;
  }

  next();
};
