import { Request, Response } from 'express';
import { REVIEW, reviewControllers } from '../controllers/review';
import { orderControllers } from '../controllers/order';
import { orderItemControllers } from '../controllers/orderItem';
import { Order } from '../models/order';

const addReview = async (req: any, res: Response) => {
  const userId = req.user.id;
  const { productId, rating, comment } = req.body;
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
    const review: REVIEW = { userId, productId, rating, comment };
    const newReview = await reviewControllers.create(review);
    res.status(201).json(newReview);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const reviewMiddlewares = {
  addReview,
};
