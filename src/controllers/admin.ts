import { models } from '../models';

type ADMIN = {
  username?: string;
  password?: string;
  email?: string;
};

const create = (data: ADMIN) => models.Admin.create(data);
const getAdminById = (id: string) => models.Admin.findById(id);
const getAdminByEmail = (email: string) => models.Admin.findOne({ email });
const update = (id: string, data: ADMIN) =>
  models.Admin.updateOne({ _id: id }, data);
const getAll = () => models.Admin.find();
const setActivity = (id: string, active: boolean) =>
  models.Admin.findByIdAndUpdate(id, { active: active });
export const adminControllers = {
  create,
  getAdminById,
  getAdminByEmail,
  update,
  getAll,
  setActivity,
};
