import { Types } from 'mongoose';
import { WISHLIST, wishlistControllers } from '../controllers/wishlist';
import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';

type UpdateWishlistData = {
  userId: Types.ObjectId;
  products: Types.ObjectId[];
};

const addProductToWishlist = async (req: any, res: Response) => {
  const { productId } = req.body;
  const userId = req.user.id;
  try {
    const product = await productControllers.getById(productId);
    if (!product) {
      return res.status(400).json({ error: 'Product not found!' });
    }

    let wishlist = await wishlistControllers.getByUserId(userId);
    if (wishlist) {
      if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
      }
      const updateWishlist: UpdateWishlistData = {
        userId,
        products: wishlist.products,
      };
      const updatedWishlist = await wishlistControllers.update(
        userId,
        updateWishlist
      );
      return res.status(200).json(updatedWishlist);
    } else {
      const newWishlist = await wishlistControllers.create({
        userId,
        products: [productId],
      });
      return res.status(201).json(newWishlist);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
export const wishlistMiddlewares = {
  addProductToWishlist,
};
