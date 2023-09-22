import { models } from '../models';

type USER = {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
  profilePicture?: string;
};

const create = (data: USER) => models.User.create(data);
const getUserById = (id: string) => models.User.findById(id);
const getUserByEmail = (email: string) => models.User.findOne({ email });
const update = (id: string, data: USER) =>
  models.User.updateOne({ _id: id }, data);
const getAll = () => models.User.find();
const setActivity = (id: string, active: boolean) =>
  models.User.findByIdAndUpdate(id, { active: active });
export const userControllers = {
  create,
  getUserById,
  getUserByEmail,
  update,
  getAll,
  setActivity,
};
