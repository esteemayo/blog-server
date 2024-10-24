import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as replyCommentController from '../controllers/reply.comment.controller.js';

const router = express.Router();

router.route('/').get(replyCommentController.getReplies);

router.route('/:id').get(replyCommentController.getReply);

export default router;