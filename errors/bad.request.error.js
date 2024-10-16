import { StatusCodes } from 'http-status-codes';

import CustomAPIError from './cutom.api.error.js';

class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

export default NotFoundError;
