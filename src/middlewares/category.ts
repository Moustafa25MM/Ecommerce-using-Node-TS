import { categoryControllers } from '../controllers/category';
import { Request, Response } from 'express';

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

export const categoryMiddlewares = {
  createCategory,
};
