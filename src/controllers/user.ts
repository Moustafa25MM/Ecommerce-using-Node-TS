import { models } from '../models';

type CreateUser = {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
};

const create = (data: CreateUser) => models.User.create(data);

export const userControllers = {
  create,
};
