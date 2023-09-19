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

export const productControllers = {
  create,
  getByName,
};
