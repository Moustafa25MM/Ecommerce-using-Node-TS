import { Types } from 'mongoose';
import { WISHLIST, wishlistControllers } from '../controllers/wishlist';
import { productControllers } from '../controllers/product';
import { Request, Response } from 'express';
import { paginationOption } from '../libs/pagination';
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
const getWishlistByUserId = async (req: any, res: Response) => {
  const userId = req.user.id;
  const wishlist = await wishlistControllers.getByUserId(userId);
  if (!wishlist) {
    return res.status(400).json({ error: 'Wishlist not found!' });
  }
  let pageSize = req.query.pageSize
    ? parseInt(req.query.pageSize as string)
    : 5;
  pageSize = Math.min(20, pageSize);
  const totalDocs = wishlist.products.length;
  const maxPageNumber = Math.ceil(totalDocs / pageSize);

  let pageNumber = req.query.pageNumber
    ? parseInt(req.query.pageNumber as string)
    : 1;
  pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
  const paginatedWishlistIds = wishlist.products.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );
  const paginatedWishlist = await Promise.all(
    paginatedWishlistIds.map(async (productId: any) => {
      const product = await productControllers.getById(productId);
      return product;
    })
  );

  const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
  return res.status(200).json({
    pagination: paginationOptions,
    userId,
    _id: wishlist._id,
    productIds: paginatedWishlist,
  });
};
const removeWishlist = async (req: any, res: Response) => {
  const userId = req.user.id;
  const wishlist = await wishlistControllers.remove(userId);
  return res
    .status(200)
    .json({ msg: 'Wishlist deleted successfully', wishlist });
};

const removeProductFromWishlist = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.body;
  try {
    let wishlist = await wishlistControllers.getByUserId(userId);
    if (!wishlist) {
      return res.status(400).json({ error: 'Wishlist not found!' });
    }
    const productIndex = wishlist.products.findIndex(
      (product) => product.toString() === productId
    );
    if (productIndex > -1) {
      wishlist.products.splice(productIndex, 1);
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
      return res.status(400).json({ error: 'Product not found in wishlist!' });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const wishlistMiddlewares = {
  addProductToWishlist,
  getWishlistByUserId,
  removeWishlist,
  removeProductFromWishlist,
};
