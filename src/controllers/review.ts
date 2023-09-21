import { models } from '../models';
import { Types } from 'mongoose';

export interface REVIEW {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment: string;
}

const create = (data: REVIEW) => models.Review.create(data);
const update = (reviewId: string, data: REVIEW) =>
  models.Review.findByIdAndUpdate(reviewId, data, { new: true });
const remove = (reviewId: string) => models.Review.findByIdAndRemove(reviewId);
const getByProductId = (productId: string) => models.Review.find({ productId });
const getByUserIdAndProductId = (userId: string, productId: string) =>
  models.Review.findOne({ userId, productId });
const getByReviewId = (reviewId: string) => models.Review.findById(reviewId);

export const reviewControllers = {
  create,
  update,
  remove,
  getByProductId,
  getByUserIdAndProductId,
  getByReviewId,
};
