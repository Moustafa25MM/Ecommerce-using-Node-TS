import { Request, Response } from 'express';
import { authMethods } from './auth';
import { adminControllers } from '../controllers/admin';

const createAdmin = async (req: Request, res: Response) => {
  const { username, email } = req.body;
  let { password } = req.body;

  password = authMethods.hashPassword(password);

  try {
    const exisitingAdmin = await adminControllers.getAdminByEmail(email);
    if (exisitingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const admin = await adminControllers.create({
      username,
      email,
      password,
    });
    if (!admin) {
      throw new Error('Failed to create admin');
    }

    return res.status(201).json(admin);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

type UpdateAdminData = {
  username?: string;
  password?: string;
  email?: string;
};
const updateAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { username, email } = req.body;
  let { password } = req.body;

  if (password) {
    password = authMethods.hashPassword(password);
  }
  const updateAdmin: UpdateAdminData = {
    username,
    email,
    password,
  };
  if (Object.values(updateAdmin).every((value) => value === undefined)) {
    return res.status(400).json({ error: 'Invalid update data was provided' });
  }
  try {
    const exisitingAdmin = await adminControllers.getAdminById(id);

    if (!exisitingAdmin) {
      throw new Error('Admin not found');
    }
    if (email) {
      const adminWithEmail = await adminControllers.getAdminByEmail(email);
      if (adminWithEmail && String(adminWithEmail._id) !== id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    const updatedResult = await adminControllers.update(id, updateAdmin);

    if (!updatedResult) {
      throw new Error('Failed to update admin');
    }
    const updatedAdmin = await adminControllers.getAdminById(id);
    if (!updatedAdmin) {
      throw new Error('Failed to fetch updated admin data');
    }

    const { _id, username } = updatedAdmin;

    const updatedAdminData = {
      id: _id,
      username,
      email,
    };

    return res.status(200).json(updatedAdminData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllAdmins = async (req: Request, res: Response) => {
  const admins = await adminControllers.getAll();
  return res.status(200).json({
    admins: admins,
  });
};

export const adminMiddlewares = {
  createAdmin,
  updateAdmin,
  getAllAdmins,
};
