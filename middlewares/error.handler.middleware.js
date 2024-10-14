import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    stack: err.stack,
    status: err.status,
    message: err.message || 'Something went wrong',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  return res.status(customError.statusCode).json({
    status: customError.status,
    stack: customError.stack,
    message: customError.message,
  });
};

export default errorHandlerMiddleware;
