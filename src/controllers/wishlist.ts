import { models } from '../models';
import { Types } from 'mongoose';

type WISHLIST_ITEM = Types.ObjectId;

export type WISHLIST = {
  userId: Types.ObjectId;
  products: WISHLIST_ITEM[];
};

const create = (data: WISHLIST) => models.Wishlist.create(data);
const getByUserId = (userId: string) => models.Wishlist.findOne({ userId });
const update = (userId: string, data: WISHLIST) =>
  models.Wishlist.findOneAndUpdate({ userId }, data, {
    new: true,
  });
const remove = (userId: string) => models.Wishlist.findOneAndRemove({ userId });

export const wishlistControllers = {
  create,
  getByUserId,
  update,
  remove,
};
