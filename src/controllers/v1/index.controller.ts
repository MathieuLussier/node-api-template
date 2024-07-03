import { NextFunction, Request, Response } from 'express';
import BaseController from '@src/base/controller.base';
import { Controller, Get, Post } from '@src/decorators/controller.decorator';

import { version } from '../../../package.json';
import Database from '@src/database';
import { validateLoginRequest } from '@src/middlewares/auth.middleware';
import UserService from '@src/services/user.service';
import { User } from '@src/models';
import ApiError from '@src/libs/apiError.lib';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';

@Controller('/v1')
export default class IndexController extends BaseController {
  private connection;

  constructor() {
    super();

    this.connection = new Database().sequelize;
    this.connection.authenticate();
  }

  @Get('/')
  public getIndex(req: Request, res: Response) {
    return res.status(this.status.OK).json({ message: `Node api v${version}` });
  }

  @Post('/refresh-token')
  public async postRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
      return;
    }

    try {
      const decoded = await jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );
      const user = await UserService.getInstance().getUserById(decoded.id);

      if (!user) {
        next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
        return;
      }

      const data = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      const accessToken = await jwt.sign(data, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      });

      return res.status(this.status.OK).json({
        message: 'Token refreshed',
        statusCode: this.status.OK,
        accessToken,
      });
    } catch (error) {
      next(new ApiError('Unauthorized', httpStatus.UNAUTHORIZED));
      return;
    }
  }

  @Post('/login', [validateLoginRequest])
  public async postLogin(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;

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

    const data = {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
    };

    const accessToken = await jwt.sign(data, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = await jwt.sign(
      { id: foundUser.id },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      }
    );

    return res.status(this.status.OK).json({
      message: 'Login successful',
      statusCode: this.status.OK,
      accessToken,
      refreshToken,
    });
  }
}
