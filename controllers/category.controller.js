import Category from '../models/category.model.js';
import * as factory from '../controllers/handler.factory.controller.js';

export const getCategories = factory.getAll(Category);
export const getCategory = factory.getOneById(Category);
export const createCategory = factory.createOne(Category);
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);
