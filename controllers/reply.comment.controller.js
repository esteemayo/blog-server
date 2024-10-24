import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import * as factory from './handler.factory.controller.js';
import ReplyComment from '../models/reply.comment.model.js';

export const getReplies = asyncHandler(async (req, res, next) => {
  const replies = await ReplyComment.find();

  return res.status(StatusCodes.OK).json(replies);
});

export const getReply = factory.getOneById(ReplyComment, 'reply');
export const createReply = factory.createOne(ReplyComment);
