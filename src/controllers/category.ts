import { models } from '../models';

type CATEGORY = {
  name?: string;
};

const create = (data: CATEGORY) => models.Category.create(data);
const getByName = (name: string) => models.Category.findOne({ name });
const getById = (id: string) => models.Category.findById(id);
const update = (id: string, data: CATEGORY) =>
  models.Category.findByIdAndUpdate(id, data, { runValidators: true });
const getAll = () => models.Category.find();
const remove = (id: string) => models.Category.findByIdAndRemove(id);
export const categoryControllers = {
  create,
  getByName,
  update,
  getAll,
  remove,
  getById,
};
