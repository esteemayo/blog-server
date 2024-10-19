import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.route('/').get(categoryController.getCategories);

router.route('/:id').get(categoryController.getCategory);

export default router;
