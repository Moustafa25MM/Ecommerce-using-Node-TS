import { Types } from 'mongoose';
import { models } from '../models';

type ADDRESS = {
  unitNumber?: string;
  streetNumber?: string;
  addressLine?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  userId?: Types.ObjectId;
};
const create = (data: ADDRESS) => models.Address.create(data);
const getByUser = (userId: string) => models.Address.find({ userId });
const getById = (id: string) => models.Address.findById(id);
const remove = (id: string) => models.Address.findByIdAndRemove(id);

export const addressControllers = {
  create,
  getByUser,
  getById,
  remove,
};
