import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Category from '../models/category.model.js';
import { NotFoundError } from '../errors/not.found.error.js';
import * as factory from '../controllers/handler.factory.controller.js';

export const getCategories = factory.getAll(Category);

export const getCategory = factory.getOneById(Category);

export const createCategory = factory.createOne(Category);

export const updateCategory = factory.updateOne(Category);

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findByIdAndDelete(categoryId);

  if (!category) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID → ${categoryId}`,
      ),
    );
  }

  return res.status(StatusCodes.NO_CONTENT).end();
});
