import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';

const createProduct = async (req: Request, res: Response) => {
  const { title, description, price, quantity, category } = req.body;
  try {
    const product = await productControllers.create({
      title,
      description,
      price,
      quantity,
      category,
    });
    if (!product) {
      throw new Error('Failed to create product');
    }

    return res.status(201).json(product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const productMiddlewares = {
  createProduct,
};
