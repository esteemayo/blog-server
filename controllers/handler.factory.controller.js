import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';

import { NotFoundError } from '../errors/not.found.error.js';

export const getAll = (Model) =>
  asyncHandler(async (req, res, next) => {
    const docs = await Model.find();

    return res.status(StatusCodes.OK).json(docs);
  });

export const getOneById = (Model, label) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findById(docId);

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no ${label} found with the given ID → ${docId}`,
        ),
      );
    }

    return res.status(StatusCodes.OK).json(doc);
  });

export const getOneBySlug = (Model, label) =>
  asyncHandler(async (req, res, next) => {
    const { slug } = req.params;

    const doc = await Model.findOne({ slug });

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no ${label} found with the given SLUG → ${slug}`,
        ),
      );
    }

    return res.status(StatusCodes.OK).json(doc);
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    if (doc) {
      return res.status(StatusCodes.CREATED).json(doc);
    }
  });

export const updateOne = (Model, label) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const updatedDoc = await Model.findByIdAndUpdate(
      docId,
      { $set: { ...req.body } },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedDoc) {
      return next(
        new NotFoundError(
          `There is no ${label} found with the given ID → ${docId}`,
        ),
      );
    }

    return res.status(StatusCodes.OK).json(updatedDoc);
  });

export const deleteOne = (Model, label) =>
  asyncHandler(async (req, res, next) => {
    const { id: docId } = req.params;

    const doc = await Model.findByIdAndDelete(docId);

    if (!doc) {
      return next(
        new NotFoundError(
          `There is no ${label} found with the given ID → ${docId}`,
        ),
      );
    }

    return res.status(StatusCodes.NO_CONTENT).end();
  });
