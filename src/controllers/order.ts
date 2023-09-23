import { models } from '../models';
import { Types } from 'mongoose';

export interface ORDER {
  userId: Types.ObjectId;
  status: 'pending' | 'shipped' | 'delivered';
  dateOrdered: Date;
  dateShipped: Date | null;
  dateDelivered: Date | null;
  totalPrice: number;
}

const create = (data: ORDER) => models.Order.create(data);
const update = (orderId: string, data: ORDER) =>
  models.Order.findByIdAndUpdate(orderId, data, { new: true });
const getByUserId = (userId: string) => models.Order.find({ userId });
const getAll = () => models.Order.find();
const getByOrderId = (orderId: string) => models.Order.findById(orderId);
export const orderControllers = {
  create,
  update,
  getByUserId,
  getAll,
  getByOrderId,
};
