import express from 'express';

import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router.route('/').get(postController.getPosts);

router.route('/:id').get(postController.getPostById);

router.get('/details/:slug', postController.getPostBySlug);

export default router;
