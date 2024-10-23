import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Comment from '../models/comment.model.js';
import * as factory from './handler.factory.controller.js';

export const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find();

  return res.status(StatusCodes.OK).json(comments);
});

export const getComment = factory.getOneById(Comment, 'comment');
export const createComment = factory.createOne(Comment);
