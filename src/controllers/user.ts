import { emit } from 'process';
import { models } from '../models';

type CreateUser = {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
};

const create = (data: CreateUser) => models.User.create(data);
const getUserById = (id: string) => models.User.findById(id);
const getUserByEmail = (email: string) => models.User.findOne({ email });
export const userControllers = {
  create,
  getUserById,
  getUserByEmail,
};
