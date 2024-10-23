import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = express.Router();

router.route('/').get(commentController.getComments);

router.route('/:id').get(commentController.getComment);

export default router;
