import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';
import * as factory from './handler.factory.controller.js';

import { NotFoundError } from '../errors/not.found.error.js';
import { ForbiddenError } from '../errors/forbidden.error.js';

export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  return res.status(StatusCodes.OK).json(posts);
});

export const getPostById = factory.getOneById(Post, 'post');
export const getPostBySlug = factory.getOneBySlug(Post, 'post');
export const createPost = factory.createOne(Post);

export const updatePost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId, role } = req.user;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID →${postId}`),
    );
  }

  if (String(post.author) !== userId || role !== 'admin') {
    return next(
      new ForbiddenError(
        'You do not have permission to perform this operation',
      ),
    );
  }

  if (req.body.title)
    req.body.slug = slugify(req.body.title, { lower: true, trim: true });

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(StatusCodes.OK).json(updatedPost);
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId, role } = req.user;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID →${postId}`),
    );
  }

  if (String(post.author) === userId || role !== 'admin') {
    return next(
      new ForbiddenError(
        'You do not have permission to perform this operation',
      ),
    );
  }

  await Post.findByIdAndDelete(postId);

  return res.status(StatusCodes.NO_CONTENT).end();
});
