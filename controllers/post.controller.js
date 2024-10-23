import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';
import * as factory from './handler.factory.controller.js';

import { NotFoundError } from '../errors/not.found.error.js';
import { ForbiddenError } from '../errors/forbidden.error.js';

export const getPosts = asyncHandler(async (req, res, next) => {
  const queryObj = {};
  const { category, featured, fields, numericFilter, sort, title } = req.query;

  if (category) {
    queryObj.category = category;
  }

  if (featured) {
    queryObj.featured = featured === 'true' ? true : false;
  }

  if (title) {
    queryObj.title = { $regex: title, $options: 'i' };
  }

  if (numericFilter) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };

    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`,
    );

    const options = ['views'];

    filters = filters.split(',').forEach((el) => {
      const [field, operator, value] = el.split('-');

      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }

  let query = Post.find(queryObj);

  if (sort) {
    const sortBy = sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    query = query.select(fieldsList);
  } else {
    query = query.select('-__v');
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;
  const counts = await Post.countDocuments();

  const numberOfPages = Math.ceil(counts / limit);
  query = query.skip(skip).limit(limit);

  const posts = await query;

  return res.status(StatusCodes.OK).json({
    page,
    counts,
    numberOfPages,
    posts,
  });
});

export const updatePost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId, role } = req.user;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
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

export const likePost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.params;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  return res.status(StatusCodes.OK).json(post);
});

export const dislikePost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.params;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  return res.status(StatusCodes.OK).json(post);
});

export const deletePost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { id: userId, role } = req.user;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  if (String(post.author) !== userId || role !== 'admin') {
    return next(
      new ForbiddenError(
        'You do not have permission to perform this operation',
      ),
    );
  }

  await Post.findByIdAndDelete(postId);

  return res.status(StatusCodes.NO_CONTENT).end();
});

export const getPostById = factory.getOneById(Post, 'post');
export const getPostBySlug = factory.getOneBySlug(Post, 'post');
export const createPost = factory.createOne(Post);
