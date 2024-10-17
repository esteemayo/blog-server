import { StatusCodes } from 'http-status-codes';

import app from '../app.js';

const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    stack: err.stack,
    status: err.status,
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (app.get('env') === 'development') {
    sendErrorDev(customError, res);
  } else if (app.get('env') === 'production') {
    sendErrorProd(customError, res);
  }
};

export default errorHandlerMiddleware;
