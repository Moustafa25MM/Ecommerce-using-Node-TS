import { models } from '../models';
import { Types } from 'mongoose';

interface ORDER {
  userId: Types.ObjectId;
  status: 'pending' | 'shipped' | 'delivered';
  dateOrdered: Date;
  dateShipped: Date;
  dateDelivered: Date;
  totalPrice: number;
}

const create = (data: ORDER) => models.Order.create(data);
const update = (orderId: string, data: ORDER) =>
  models.Order.findByIdAndUpdate(orderId, data, { new: true });
const getByUserId = (userId: string) => models.Order.find({ userId });

export const orderControllers = {
  create,
  update,
  getByUserId,
};
