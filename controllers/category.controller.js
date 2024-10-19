import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Category from '../models/category.model.js';

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  return res.status(StatusCodes.OK).json(categories);
});
