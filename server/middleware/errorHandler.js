import httpStatus from 'http-status';
import ApiError from '../utils/ApiError.js';
import { config } from '../config/env.js';

const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};


const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[statusCode];
  }

  res.status(statusCode || 500).json({
    success: false,
    message,
    ...(config.env !== 'production' && { stack: err.stack }),
  });
};

export { errorConverter, errorHandler };
