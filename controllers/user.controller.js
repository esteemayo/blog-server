import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import asyncHandler from 'express-async-handler';

import User from '../models/user.model.js';

import CustomAPIError from '../errors/cutom.api.error.js';
import NotFoundError from '../errors/not.found.error.js';
import BadRequesError from './../errors/bad.request.error.js';

import { createSendToken } from '../utils/create.send.token.util.js';

export const updateMe = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm) {
    return next(
      new BadRequesError(
        `This route is not for password updates. Please use ${req.protocol}://${req.get('host')}/api/v1/auth/update-my-password`,
      ),
    );
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with the given ID → ${userId}`),
    );
  }

  const filterBody = _.pick(req.body, [
    'name',
    'email',
    'phone',
    'bio',
    'image',
  ]);

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { ...filterBody } },
    {
      new: true,
      runValidators: true,
    },
  );

  return createSendToken(updatedUser, StatusCodes.OK, req, res);
});

export const deleteMe = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId);

  if (!user) {
    return next(
      new NotFoundError(`There is no user found with the given ID → ${userId}`),
    );
  }

  await User.findByIdAndUpdate(userId, { $set: { isActive: false } });

  return res.status(StatusCodes.NO_CONTENT).end();
});
