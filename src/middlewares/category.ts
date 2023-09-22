import { categoryControllers } from '../controllers/category';
import { Request, Response } from 'express';
import { paginationOption } from '../libs/pagination';

const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const existingCategory = await categoryControllers.getByName(name);
    if (existingCategory) {
      return res.status(400).json({ error: 'Category Name already exists' });
    }
    const category = await categoryControllers.create({
      name,
    });
    if (!category) {
      throw new Error('Failed to create category');
    }

    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryControllers.getAll();
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = categories.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedCategories = categories.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      categories: paginatedCategories,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

type UpdateCategoryData = {
  name?: string;
};

const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { name } = req.body;
  const updateCategory: UpdateCategoryData = {
    name,
  };
  if (Object.values(updateCategory).every((value) => value === undefined)) {
    return res.status(400).json({ error: 'Invalid update data was provided' });
  }
  try {
    const existingCategory = await categoryControllers.getById(id);

    if (!existingCategory) {
      throw new Error('Category not found');
    }
    if (name) {
      const categoryWithName = await categoryControllers.getByName(name);
      if (categoryWithName && String(categoryWithName._id) !== id) {
        return res.status(400).json({ error: 'Category Name already exists' });
      }
    }
    const updatedResult = await categoryControllers.update(id, updateCategory);

    if (!updatedResult) {
      throw new Error('Failed to update Category');
    }
    const updatedCategory = await categoryControllers.getById(id);
    if (!updatedCategory) {
      throw new Error('Failed to fetch updated Category data');
    }

    const { _id } = updatedCategory;

    const updatedCategoryData = {
      id: _id,
      name,
    };

    return res.status(200).json(updatedCategoryData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const removeCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const existingCategory = await categoryControllers.getById(id);
  if (!existingCategory) {
    throw new Error('Category not found');
  }
  const removedCategory = await categoryControllers.remove(id);
  return res
    .status(200)
    .json({ category: removedCategory, msg: 'deleted Successfully' });
};

export const categoryMiddlewares = {
  createCategory,
  getAllCategories,
  updateCategory,
  removeCategory,
};
