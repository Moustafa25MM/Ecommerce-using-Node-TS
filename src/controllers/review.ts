import { models } from '../models';
import { Types } from 'mongoose';

export interface REVIEW {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment: string;
}

const create = (data: REVIEW) => models.Review.create(data);

export const reviewControllers = {
  create,
};
