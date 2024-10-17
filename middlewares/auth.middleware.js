import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

import User from '../models/user.model.js';

import ForbiddenError from './../errors/forbidden.error.js';
import UnauthenticatedError from './../errors/unauthenticated.error.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ').pop();
  } else if (req.cookie.authToken) {
    token = req.cookie.authToken;
  }

  if (!token) {
    return next(
      new UnauthenticatedError(
        'You are not logged in! Please log in to get access',
      ),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new UnauthenticatedError(
        'The user belonging to this token does no longer exist',
      ),
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new UnauthenticatedError(
        'User recently changed password! Please log in again',
      ),
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          'You do not have permission to perform this operation',
        ),
      );
    }

    next();
  };
