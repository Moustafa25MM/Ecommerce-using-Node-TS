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

export const orderItemControllers = {
  createMany,
  getByOrderId,
};
