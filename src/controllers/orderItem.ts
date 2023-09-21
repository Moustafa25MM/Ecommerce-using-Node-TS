import { models } from '../models';
import { Types } from 'mongoose';

export interface ORDERITEM {
  productId: Types.ObjectId;
  price: number;
  quantity: number;
  orderId: Types.ObjectId;
}

const createMany = (data: ORDERITEM[]) => models.OrderItems.insertMany(data);
const getByOrderId = (orderId: string) => models.OrderItems.find({ orderId });
const getAll = () => models.OrderItems.find();
const getByProductId = (productId: string) =>
  models.OrderItems.find({ productId });
export const orderItemControllers = {
  createMany,
  getByOrderId,
  getAll,
  getByProductId,
};
