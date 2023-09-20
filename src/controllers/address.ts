import { Types } from 'mongoose';
import { models } from '../models';

type ADDRESS = {
  unitNumber?: string;
  streetNumber?: string;
  addressLine?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  user?: Types.ObjectId;
};
const create = (data: ADDRESS) => models.Address.create(data);

export const addressControllers = {
  create,
};
