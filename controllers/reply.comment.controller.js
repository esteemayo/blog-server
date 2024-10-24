import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import * as factory from './handler.factory.controller.js';
import ReplyComment from '../models/reply.comment.model.js';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import { NotFoundError } from '../errors/not.found.error.js';
import { ForbiddenError } from '../errors/forbidden.error.js';

export const getReplies = asyncHandler(async (req, res, next) => {
  const replies = await ReplyComment.find();

  return res.status(StatusCodes.OK).json(replies);
});

export const updateReply = asyncHandler(async (req, res, next) => {
  const { id: replyId } = req.params;
  const { is: userId, role } = req.user;

  const reply = await ReplyComment.findById(replyId);

  if (!reply) {
    return next(
      new NotFoundError(
        `There is no reply found with the given ID → ${replyId}`,
      ),
    );
  }

  const comment = await Comment.findById(reply.comment);

  if (!comment) {
    return next(
      new NotFoundError(
        `There is no comment found with the given ID → ${reply.comment}`,
      ),
    );
  }

  const post = await Post.findById(reply.post);

  if (!post) {
    return next(
      new NotFoundError(
        `There is no post found with the given ID → ${reply.post}`,
      ),
    );
  }

  if (
    String(reply.author) === userId ||
    String(comment.author) === userId ||
    String(post.author) === userId ||
    role === 'admin'
  ) {
    const updatedPost = await ReplyComment.findByIdAndUpdate(
      replyId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(StatusCodes.OK).json(updatedPost);
  }

  return next(new ForbiddenError('You are not allowed to perform this action'));
});

export const getReply = factory.getOneById(ReplyComment, 'reply');
export const createReply = factory.createOne(ReplyComment);
