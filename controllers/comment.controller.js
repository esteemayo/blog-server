import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';
import Comment from '../models/comment.model.js';
import * as factory from './handler.factory.controller.js';
import { ForbiddenError } from '../errors/forbidden.error.js';

export const getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find();

  return res.status(StatusCodes.OK).json(comments);
});

export const updateComment = asyncHandler(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { id: userId, role } = req.user;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(
      new NotFoundError(
        `There is no comment found with the given ID → ${commentId}`,
      ),
    );
  }

  const post = await Post.findById(comment.post);

  if (!post) {
    return next(
      new NotFoundError(
        `There is no post found with the given ID → ${post?._id}`,
      ),
    );
  }

  if (
    String(comment.author._id) !== userId ||
    String(post.author._id) !== userId ||
    role !== 'admin'
  ) {
    return next(
      new ForbiddenError('You are not allowed to perform this action'),
    );
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(StatusCodes.OK).json(updatedComment);
});

export const getComment = factory.getOneById(Comment, 'comment');
export const createComment = factory.createOne(Comment);
