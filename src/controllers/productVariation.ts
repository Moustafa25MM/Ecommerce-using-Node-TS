import { Types } from 'mongoose';
import { models } from '../models';
import Product from '../models/product';
import { Size } from '../models/productVariation';

type PRODUCTVARIATION = {
  productId: Types.ObjectId;
  color: string;
  size: Size;
  quantity: number;
};

const create = async (data: PRODUCTVARIATION) => {
  // Check if total quantity of variations does not exceed product quantity
  const product = await models.Product.findById(data.productId);
  if (!product) {
    throw new Error('Product not found');
  }
  const variations = await models.ProductVariation.find({
    productId: data.productId,
  });
  const totalQuantity = variations.reduce(
    (total, variation) => total + variation.quantity,
    0
  );
  if (totalQuantity + data.quantity > product.quantity) {
    throw new Error('Total quantity of variations exceeds product quantity');
  }
  return models.ProductVariation.create(data);
};

export const productVariationControllers = {
  create,
};
