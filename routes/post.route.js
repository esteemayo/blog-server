import express from 'express';

import * as postController from '../controllers/post.controller.js';

const router = express.Router();

router.route('/').get(postController.getPosts);

export default router;
