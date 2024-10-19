import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import Category from '../models/category.model.js';
import { NotFoundError } from '../errors/not.found.error.js';
import * as factory from '../controllers/handler.factory.controller.js';

export const getCategories = factory.getAll(Category);

export const getCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const category = await Category.findById(categoryId);

  if (!category) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID → ${categoryId}`,
      ),
    );
  }

  return res.status(StatusCodes.OK).json(category);
});

export const createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create({ ...req.body });

  if (category) {
    return res.status(StatusCodes.CREATED).json(category);
  }
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id: categoryId } = req.params;

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: { ...req.body } },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedCategory) {
    return next(
      new NotFoundError(
        `There is no category found with the given ID → ${categoryId}`,
      ),
    );
  }

  return res.status(StatusCodes.OK).json(updatedCategory);
});

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
