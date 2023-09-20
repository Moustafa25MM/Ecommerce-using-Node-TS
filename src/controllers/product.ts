import { models } from '../models';
import Category from '../models/category';

type PRODUCT = {
  title: string;
  description: string;
  price: number;
  quantity: number;
  category: Category;
};

const create = (data: PRODUCT) => models.Product.create(data);
const getByName = (name: string) => models.Product.findOne({ name });
const getById = (id: string) => models.Product.findById(id);
const update = (id: string, data: PRODUCT) =>
  models.Product.findByIdAndUpdate(id, data, { runValidators: true });
const remove = (id: string) => models.Product.findByIdAndRemove(id);
const getAll = () => models.Product.find();

export const productControllers = {
  create,
  getByName,
  getById,
  update,
  remove,
  getAll,
};
