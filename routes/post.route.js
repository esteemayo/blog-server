import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router
  .route('/')
  .get(postController.getPosts)
  .post(authMiddleware.protect, postController.createPost);

router.route('/:id').get(postController.getPostById);

router.get('/details/:slug', postController.getPostBySlug);

export default router;
