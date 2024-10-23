import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router
  .route('/')
  .get(postController.getPosts)
  .post(authMiddleware.protect, postController.createPost);

router
  .route('/:id')
  .get(postController.getPostById)
  .patch(authMiddleware.protect, postController.updatePost)
  .delete(authMiddleware.protect, postController.deletePost);

router.get('/relatedPosts', postController.getRelatedPosts);

router.get('/details/:slug', postController.getPostBySlug);

router.patch('/likes/:id', authMiddleware.protect, postController.likePost);

router.patch(
  '/dislikes/:id',
  authMiddleware.protect,
  postController.dislikePost,
);

export default router;
