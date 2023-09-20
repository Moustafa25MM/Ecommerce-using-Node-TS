import { ObjectId, Types } from 'mongoose';
import { models } from '../models';

type CART_ITEM = {
  productId: Types.ObjectId;
  quantity: number;
};

export type CART = {
  userId: Types.ObjectId;
  items: CART_ITEM[];
};

const create = (data: CART) => models.Cart.create(data);
const getByUserId = (userId: string) => models.Cart.findOne({ userId });
const update = (userId: string, data: CART) =>
  models.Cart.findOneAndUpdate({ userId }, data, {
    new: true,
  });
const remove = (userId: string) => models.Cart.findOneAndRemove({ userId });
const getAll = (userId: string) => models.Cart.find({ userId });

export const cartControllers = {
  create,
  getByUserId,
  update,
  remove,
  getAll,
};
