import { Request, Response } from 'express';
import { productVariationControllers } from '../controllers/productVariation';
import { Size } from '../models/productVariation';
import { productControllers } from '../controllers/product';
import { paginationOption } from '../libs/pagination';

const createProductVariation = async (req: Request, res: Response) => {
  const { productId, color, size, quantity } = req.body;
  if (!productId || !color || !size || !quantity || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!Object.values(Size).includes(size)) {
    return res.status(400).json({ error: 'Invalid size value' });
  }
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  try {
    const productVariation = await productVariationControllers.create({
      productId,
      color,
      size,
      quantity,
    });
    if (!productVariation) {
      throw new Error('Failed to create product variation');
    }
    return res.status(201).json(productVariation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const updateProductVariation = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, color, size, quantity } = req.body;
  if (!productId || !color || !size || !quantity || quantity === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!Object.values(Size).includes(size)) {
    return res.status(400).json({ error: 'Invalid size value' });
  }
  if (isNaN(quantity) || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  try {
    const productVariation = await productVariationControllers.getById(id);
    if (!productVariation) {
      return res.status(404).json({ error: 'Product Variation not found' });
    }

    const product = await productControllers.getById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    const variations = await productVariationControllers.getByProductId(
      String(product._id)
    );
    const totalQuantity = variations.reduce(
      (total, variation) => total + variation.quantity,
      0
    );

    if (
      totalQuantity - productVariation.quantity + quantity >
      product.quantity
    ) {
      throw new Error('Total quantity of variations exceeds product quantity');
    }
    const updatedProductVariation = await productVariationControllers.update(
      id,
      { productId, color, size, quantity }
    );
    if (!updatedProductVariation) {
      throw new Error('Failed to update product variation');
    }
    return res.status(200).json(updatedProductVariation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
const removeProductVariation = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const removedProductVariation =
      await productVariationControllers.remove(id);
    if (!removedProductVariation) {
      throw new Error('Failed to remove product variation');
    }
    return res
      .status(200)
      .json({ msg: 'Product Variation removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getProductVariationById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productVariation = await productVariationControllers.getById(id);
  if (!productVariation) {
    return res.status(404).json({ error: 'Product Variation not found' });
  }
  return res.status(200).json(productVariation);
};
const getAllProductVariations = async (req: Request, res: Response) => {
  try {
    const productVariations = await productVariationControllers.getAll();
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = productVariations.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedProductVariations = productVariations.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      productVariations: paginatedProductVariations,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
const getVariationsByProductId = async (req: Request, res: Response) => {
  const { productId } = req.params;

  try {
    const variations =
      await productVariationControllers.getByProductId(productId);
    if (variations.length === 0) {
      return res
        .status(404)
        .json({ error: 'No variations found for the given product ID' });
    }
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = variations.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedVariations = variations.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      variations,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
export const productVariationMiddlewares = {
  createProductVariation,
  getProductVariationById,
  getAllProductVariations,
  updateProductVariation,
  removeProductVariation,
  getVariationsByProductId,
};
