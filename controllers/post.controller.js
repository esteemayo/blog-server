import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';
import * as factory from './handler.factory.controller.js';

export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  return res.status(StatusCodes.OK).json(posts);
});

export const getPostById = factory.getOneById(Post);
export const getPostBySlug = factory.getOneBySlug(Post);
export const createPost = factory.createOne(Post);
export const updatePost = factory.updateOne(Post);
export const deletePost = factory.deleteOne(Post);
