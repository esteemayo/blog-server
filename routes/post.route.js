import express from 'express';

import commentRoute from './comment.route.js';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router.use('/:postId/comments', commentRoute);

router.get('/my-posts', authMiddleware.protect, postController.getMyPosts);

router.get('/trend', postController.getTrendingPosts);

router.get('/related-posts', postController.getRelatedPosts);

router.get(
  '/liked-posts',
  authMiddleware.protect,
  postController.getUserLikedPosts,
);

router.get(
  '/disliked-posts',
  authMiddleware.protect,
  postController.getUserDisikedPosts,
);

router.get('/tags', postController.getTags);

router.get('/search', postController.searchPosts);

router.get('/details/:slug', postController.getPostBySlug);

router.patch('/views/:id', postController.updateViews);

router.patch('/likes/:id', authMiddleware.protect, postController.likePost);

router.patch(
  '/dislikes/:id',
  authMiddleware.protect,
  postController.dislikePost,
);

router
  .route('/')
  .get(postController.getPosts)
  .post(authMiddleware.protect, postController.createPost);

router
  .route('/:id')
  .get(postController.getPostById)
  .patch(authMiddleware.protect, postController.updatePost)
  .delete(authMiddleware.protect, postController.deletePost);

export default router;
