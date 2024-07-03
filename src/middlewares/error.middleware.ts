import ApiError from '@src/libs/apiError.lib';
import { InstanceError } from 'sequelize';
import { ValidationError } from 'express-validation';
import httpStatus from 'http-status';
import logger from '@src/utils/logger.util';

export const errorConverter = (err, req, res) => {
  let error = err;
  if (!(error instanceof ApiError || error instanceof ValidationError)) {
    const statusCode =
      error.statusCode || error instanceof InstanceError
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(
      statusCode,
      message
      // process.env.NODE_ENV === 'production',
      // err.stack
    );
  }
  return error;
};

export const errorHandler = (err, req, res) => {
  let { statusCode, message } = err;
  statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  message = err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // if (process.env.NODE_ENV === 'production' && !err.isPublic) {
  //   statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  //   message = err.message || httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  // }

  const response: {
    statusCode: any;
    message: any;
    stack?: any;
    details?: any;
  } = {
    statusCode,
    message,
    // ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  if (err instanceof ValidationError) response.details = err.details;

  if (statusCode === httpStatus.INTERNAL_SERVER_ERROR) {
    logger.error(err);
  }

  return res.status(statusCode).json(response);
};
