import { Types } from 'mongoose';
import { CART, cartControllers } from '../controllers/cart';
import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';
import { paginationOption } from '../libs/pagination';

type CART_ITEMS = {
  productId: Types.ObjectId;
  quantity: number;
};

type UpdateCartData = {
  userId: Types.ObjectId;
  items: CART_ITEMS[];
};

const addProductToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;
  try {
    const product = await productControllers.getById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found!' });
    }

    if (quantity > product.quantity) {
      return res
        .status(400)
        .json({ error: 'Requested quantity exceeds available stock!' });
    }
    let cart = await cartControllers.getByUserId(userId);
    if (cart) {
      const productIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (productIndex > -1) {
        cart.items[productIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      const updateCart: UpdateCartData = {
        userId,
        items: cart.items,
      };
      const updatedCart = await cartControllers.update(userId, updateCart);
      return res.status(200).json(updatedCart);
    } else {
      const newCart = await cartControllers.create({
        userId,
        items: [{ productId, quantity }],
      });
      return res.status(201).json(newCart);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const removeCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await cartControllers.remove(userId);
  return res.status(200).json({ msg: 'Cart deleted successfully', cart });
};
const getCartByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const cart = await cartControllers.getAll(userId);
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found!' });
    }
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = cart[0].items.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedCart = cart[0].items.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      userId,
      cart: paginatedCart,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const decrementProductQuantity = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  try {
    let cart = await cartControllers.getByUserId(userId);
    if (!cart) {
      return res.status(400).json({ error: 'Cart not found!' });
    }
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (productIndex > -1) {
      cart.items[productIndex].quantity -= 1;
      if (cart.items[productIndex].quantity <= 0) {
        cart.items.splice(productIndex, 1);
      }
      const updateCart: UpdateCartData = {
        userId,
        items: cart.items,
      };
      const updatedCart = await cartControllers.update(userId, updateCart);
      return res.status(200).json(updatedCart);
    } else {
      return res.status(400).json({ error: 'Product not found!' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const cartMiddlewares = {
  addProductToCart,
  removeCart,
  getCartByUserId,
  decrementProductQuantity,
};
