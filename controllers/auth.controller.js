import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import BadRequesError from './../errors/bad.request.error.js';
import User from '../models/user.models.js';
import { createSendToken } from './../utils/create.send.token.util.js';

export const register = asyncHandler(async (req, res, next) => {
  const user = await User.create({ ...req.body });

  if (user) {
    return createSendToken(user, StatusCodes.CREATED, req, res);
  }
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequesError('Please provide email and password'));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new BadRequesError('Incorrect email or password'));
  }

  return createSendToken(user, StatusCodes.OK, req, res);
});
