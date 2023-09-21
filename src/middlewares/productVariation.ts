import { Request, Response } from 'express';
import { productVariationControllers } from '../controllers/productVariation';
import { Size } from '../models/productVariation';

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

export const productVariationMiddlewares = {
  createProductVariation,
};
