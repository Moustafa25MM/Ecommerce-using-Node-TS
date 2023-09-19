import { models } from '../models';

type CATEGORY = {
  name?: string;
};

const create = (data: CATEGORY) => models.Category.create(data);
const getByName = (name: string) => models.Category.findOne({ name });
export const categoryControllers = {
  create,
  getByName,
};
