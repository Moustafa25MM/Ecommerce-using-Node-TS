import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';
import Category from '../models/category';
import { categoryControllers } from '../controllers/category';

const createProduct = async (req: Request, res: Response) => {
  const { title, description, price, quantity, category } = req.body;
  try {
    const categoryExists = await categoryControllers.getById(category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

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

type UpdateProductData = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { title, description, price, quantity, category } = req.body;
  const updateProduct: UpdateProductData = {
    title,
    description,
    price,
    quantity,
    category,
  };
  if (Object.values(updateProduct).every((value) => value === undefined)) {
    return res.status(400).json({ error: 'Invalid update data was provided' });
  }
  try {
    const existingProduct = await productControllers.getById(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }
    const categoryExists = await categoryControllers.getById(category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
    const updatedResult = await productControllers.update(id, updateProduct);

    if (!updatedResult) {
      throw new Error('Failed to update Product');
    }
    const updatedProduct = await productControllers.getById(id);
    if (!updatedProduct) {
      throw new Error('Failed to fetch updated Product data');
    }

    const { _id } = updatedProduct;

    const updatedProductData = {
      id: _id,
      title,
      description,
      quantity,
      price,
      category,
    };

    return res.status(200).json(updatedProductData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productControllers.getById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  return res.status(200).json(product);
};

const removeProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await productControllers.getById(id);
  if (!product) {
    throw new Error('Product not found');
  }
  const removedProduct = await productControllers.remove(id);
  return res
    .status(200)
    .json({ removedProduct: removedProduct, msg: 'deleted Successfully' });
};

const getAllProducts = async (req: Request, res: Response) => {
  const categories = await productControllers.getAll();
  return res.status(200).json(categories);
};

export const productMiddlewares = {
  createProduct,
  updateProduct,
  getProductById,
  removeProduct,
  getAllProducts,
};
