import { Request, Response } from 'express';
import { REVIEW, reviewControllers } from '../controllers/review';
import { orderControllers } from '../controllers/order';
import { orderItemControllers } from '../controllers/orderItem';
import { Order } from '../models/order';
import { productControllers } from '../controllers/product';
import { paginationOption } from '../libs/pagination';

const addReview = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;
  if (!rating || !comment) {
    return res.status(400).json({ message: 'Invalid data to add' });
  }
  try {
    // Check if the user has ordered the product
    const orders = await orderControllers.getByUserId(userId);
    let hasOrdered = false;
    for (const order of orders) {
      const items = await orderItemControllers.getByOrderId(String(order._id));
      if (items.some((item) => String(item.productId) === productId)) {
        hasOrdered = true;
        break;
      }
    }
    if (!hasOrdered) {
      return res
        .status(403)
        .json({ error: 'User has not ordered this product' });
    }
    const existingReview = await reviewControllers.getByUserIdAndProductId(
      userId,
      productId
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ error: 'User has already reviewed this product' });
    }
    const review: REVIEW = { userId, productId, rating, comment };
    const newReview = await reviewControllers.create(review);
    return res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateReview = async (req: any, res: Response) => {
  const userId = req.user.id;
  const reviewId = req.params.id;
  const { productId, rating, comment } = req.body;
  if (!rating || !comment) {
    return;
    res.status(400).json({ message: 'Invalid data to update' });
  }
  const updateData: REVIEW = {
    userId,
    productId,
    rating,
    comment,
  };
  try {
    const updatedReview = await reviewControllers.update(reviewId, updateData);
    res.json(updatedReview);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const deleteReview = async (req: any, res: Response) => {
  const reviewId = req.params.id;
  const isExisted = await reviewControllers.getByReviewId(reviewId);
  if (!isExisted) {
    return res.status(400).json({ message: 'you already deleted the review' });
  }
  try {
    await reviewControllers.remove(reviewId);
    return res.json({ message: 'Review deleted' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getReviewsForProduct = async (req: Request, res: Response) => {
  const productId = req.params.productId;
  const isExisted = await productControllers.getById(productId);
  if (!isExisted) {
    return res.status(400).json({ messgae: 'no product found!' });
  }
  try {
    const reviews = await reviewControllers.getByProductId(productId);
    let pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 5;
    pageSize = Math.min(20, pageSize);
    const totalDocs = reviews.length;
    const maxPageNumber = Math.ceil(totalDocs / pageSize);

    let pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber as string)
      : 1;
    pageNumber = Math.min(Math.max(pageNumber, 1), maxPageNumber);
    const paginatedReviews = reviews.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );

    const paginationOptions = paginationOption(pageSize, pageNumber, totalDocs);
    return res.status(200).json({
      pagination: paginationOptions,
      reviews: paginatedReviews,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const reviewMiddlewares = {
  addReview,
  updateReview,
  deleteReview,
  getReviewsForProduct,
};
