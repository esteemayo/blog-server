import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Comment from '../models/comment.model.js';

export const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find();

  return res.status(StatusCodes.OK).json(comments);
});
