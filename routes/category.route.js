import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router
  .route('/')
  .get(categoryController.getCategories)
  .post(authMiddleware.restrictTo('admin'), categoryController.createCategory);

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(authMiddleware.restrictTo('admin'), categoryController.updateCategory)
  .delete(
    authMiddleware.restrictTo('admin'),
    categoryController.deleteCategory,
  );

export default router;
