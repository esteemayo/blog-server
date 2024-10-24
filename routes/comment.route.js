import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as commentController from '../controllers/comment.controller.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.getComments)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    commentController.createComment,
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(authMiddleware.protect, commentController.updateComment)
  .delete(authMiddleware.protect, commentController.deleteComment);

export default router;
