import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';

export const getPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find();

  return res.status(StatusCodes.OK).json(posts);
});
