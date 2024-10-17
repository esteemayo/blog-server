import express from 'express';

import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.post('/forgot-password', authController.forgotPassword);

router.patch('/reset-password/:token', authController.resetPassword);

export default router;
