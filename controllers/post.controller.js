/* eslint-disable */

import { StatusCodes } from 'http-status-codes';
import slugify from 'slugify';
import asyncHandler from 'express-async-handler';

import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Comment from '../models/comment.model.js';

import { NotFoundError } from '../errors/not.found.error.js';
import { ForbiddenError } from '../errors/forbidden.error.js';

import * as factory from './handler.factory.controller.js';

export const getPosts = asyncHandler(async (req, res, next) => {
  const queryObj = {};
  let { category, featured, fields, limit, numericFilter, page, sort, title } =
    req.query;

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

    const options = ['views', 'likeCount', 'dislikeCount'];

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

  page = Number(page) || 1;
  limit = Number(limit) || 20;

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

export const getMyPosts = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const posts = await Post.find({ author: userId });

  return res.status(StatusCodes.OK).json(posts);
});

export const getTrendingPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find().sort('-views');

  return res.status(StatusCodes.OK).json(posts);
});

export const getFeaturedPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.getFeaturedPosts();

  return res.status(StatusCodes.OK).json(posts);
});

export const getRelatedPosts = asyncHandler(async (req, res, next) => {
  const tags = req.query.tags.split(',');

  const posts = await Post.find({ tags: { $in: tags } })
    .limit(20)
    .sort('-createdAt');

  return res.status(StatusCodes.OK).json(posts);
});

export const getBookmarkedPosts = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId).populate('bookmarks');

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with the given ID → ${userId}`),
    );
  }

  return res.status(StatusCodes.OK).json(user.bookmarks);
});

export const getUserLikedPosts = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const posts = await Post.find({ likes: userId }).sort('-_id');

  return res.status(StatusCodes.OK).json(posts);
});

export const getUserDisikedPosts = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const posts = await Post.find({ dislikes: userId }).sort('-_id');

  return res.status(StatusCodes.OK).json(posts);
});

export const getPostComentUsers = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const comments = await Comment.find({ post: postId });
  const users = comments.map((comment) => comment.author);

  return res.status(StatusCodes.OK).json(users);
});

export const getPostsByCategory = asyncHandler(async (req, res, next) => {
  const { category } = req.params;

  const posts = await Post.find({ category }).sort('-_id');

  return res.status(StatusCodes.OK).json(posts);
});

export const getTags = asyncHandler(async (req, res, next) => {
  const tags = await Post.getTagsList();

  return res.status(StatusCodes.OK).json(tags);
});

export const getPostsByTag = asyncHandler(async (req, res, next) => {
  const { tag } = req.params;
  const tagQuery = tag || { $exists: true };

  const posts = await Post.find({ tags: { $in: [tagQuery] } }).sort(
    '-createdAt',
  );

  return res.status(StatusCodes.OK).json(posts);
});

export const searchPosts = asyncHandler(async (req, res, next) => {
  let { limit, page, q } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 20;

  const skip = (page - 1) * limit;
  const counts = await Post.countDocuments({ $text: { $search: q } });

  const numberOfPages = Math.ceil(counts / limit);

  const query = Post.find(
    {
      $text: {
        $search: q,
      },
    },
    {
      score: {
        $meta: 'textScore',
      },
    },
  );

  const posts = await query
    .skip(skip)
    .limit(limit)
    .sort({
      score: {
        $meta: 'textScore',
      },
    });

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

export const bookmarkPost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with the given ID → ${userId}`),
    );
  }

  if (user.bookmarks.includes(postId)) {
    user.bookmarks.pull(postId);
    await user.save({ validateBeforeSave: false });

    return res.status(StatusCodes.OK).json('Post removed from bookmarks');
  }

  user.bookmarks.push(postId);
  await user.save({ validateBeforeSave: false });

  return res.status(StatusCodes.OK).json('Post bookmarked successfully');
});

export const updateViews = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  const updatedViews = await Post.findByIdAndUpdate(
    postId,
    { $inc: { views: 1 } },
    {
      new: true,
      runValidators: true,
    },
  );

  return res.status(StatusCodes.OK).json(updatedViews);
});

export const likePost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  if (post.dislikes.includes(userId)) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { dislikes: userId },
        $inc: { dislikeCount: -1 },
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { likes: userId },
        $inc: { likeCount: 1 },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  return res.status(StatusCodes.OK).json(post);
});

export const dislikePost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);

  if (!post) {
    return next(
      new NotFoundError(`There is no post found with the given ID → ${postId}`),
    );
  }

  if (post.likes.includes(userId)) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: userId },
        $inc: { likeCount: -1 },
        $addToSet: { dislikes: userId },
        $inc: { dislikeCount: 1 },
      },
      {
        new: true,
        runValidators: true,
      },
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $addToSet: { dislikes: userId },
        $inc: { dislikeCount: 1 },
      },
      {
        new: true,
        runValidators: true,
      },
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

export const getPostById = factory.getOneById(Post, 'post', 'comments');
export const getPostBySlug = factory.getOneBySlug(Post, 'post', 'comments');
export const createPost = factory.createOne(Post);
