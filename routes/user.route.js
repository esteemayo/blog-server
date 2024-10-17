import express from 'express';

import * as authMiddleware from '../middlewares/auth.middleware.js';
import * as userController from '../controllers/user.controller.js';

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/update-me', userController.updateMe);

router.delete('/delete-me', userController.deleteMe);

router.route('/').get(userController.getUsers).post(userController.createUser);

router.route('/:id').get(userController.getUser);

export default router;
