import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';
import Category from '../models/category';
import { categoryControllers } from '../controllers/category';
import { cloudi } from './imagesUpload';

const createProduct = async (req: Request, res: Response) => {
  const { title, description, price, quantity, category } = req.body;
  try {
    const categoryExists = await categoryControllers.getById(category);
    if (!categoryExists) {
      throw new Error('Category not found');
    }
    let image = '';
    if (req.file) {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      image = uploadedImg.url;
    }
    const product = await productControllers.create({
      title,
      description,
      price,
      quantity,
      category,
      image,
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
  image: string;
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { title, description, price, quantity, category } = req.body;

  try {
    const existingProduct = await productControllers.getById(id);

    if (!existingProduct) {
      throw new Error('Product not found');
    }
    if (!title || !description || !price || !quantity || !category) {
      return res.status(400).json({
        error: 'At least one field should be provided for the update',
      });
    }
    if (category) {
      const categoryExists = await categoryControllers.getById(category);
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }
    let image = '';
    if (req.file) {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      image = uploadedImg.url;
    } else {
      image = existingProduct.image;
    }
    const updateProduct: UpdateProductData = {
      title,
      description,
      price,
      quantity,
      category,
      image,
    };

    const updatedResult = await productControllers.update(id, updateProduct);

    if (!updatedResult) {
      throw new Error('Failed to update Product');
    }
    const updatedProduct = await productControllers.getById(id);
    if (!updatedProduct) {
      throw new Error('Failed to fetch updated Product data');
    }

    return res.status(200).json(updatedProduct);
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
