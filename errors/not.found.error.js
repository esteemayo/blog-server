import { StatusCodes } from 'http-status-codes';

import CustomAPIError from './cutom.api.error.js';

export class NotFoundError extends CustomAPIError {
  constructor(message) {
    super(message);

    this.status = 'fail';
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
