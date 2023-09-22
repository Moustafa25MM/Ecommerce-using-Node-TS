import { userControllers } from '../controllers/user';
import { Request, Response } from 'express';
import { authMethods } from './auth';
import { cloudi } from './imagesUpload';

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email } = req.body;
  let { password } = req.body;
  console.log(req);
  console.log(password);
  if (password === undefined) {
    return res.status(500);
  }
  password = authMethods.hashPassword(password);
  try {
    const existingUser = await userControllers.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    let profilePicture = '';
    if (req.file) {
      const uploadedImg = await cloudi.uploader.upload(req.file.path, {
        public_id: `${Date.now}`,
        width: 500,
        height: 500,
        crop: 'fill',
      });
      profilePicture = uploadedImg.url;
    }
    const user = await userControllers.create({
      firstName,
      lastName,
      email,
      password,
      profilePicture,
    });
    if (!user) {
      throw new Error('Failed to create employee');
    }

    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

type UpdateUserData = {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
};
const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { firstName, lastName, email } = req.body;
  let { password } = req.body;

  if (password) {
    password = authMethods.hashPassword(password);
  }
  const updateUser: UpdateUserData = {
    firstName,
    lastName,
    email,
    password,
  };
  if (Object.values(updateUser).every((value) => value === undefined)) {
    return res.status(400).json({ error: 'Invalid update data was provided' });
  }
  try {
    const existingUser = await userControllers.getUserById(id);

    if (!existingUser) {
      throw new Error('User not found');
    }
    if (email) {
      const userWithEmail = await userControllers.getUserByEmail(email);
      if (userWithEmail && String(userWithEmail._id) !== id) {
        return res.status(400).json({ error: 'Email already exists' });
      }
    }
    const updatedResult = await userControllers.update(id, updateUser);

    if (!updatedResult) {
      throw new Error('Failed to update employee');
    }
    const updatedEmployee = await userControllers.getUserById(id);
    if (!updatedEmployee) {
      throw new Error('Failed to fetch updated employee data');
    }

    const { _id, firstName, lastName } = updatedEmployee;

    const updatedUserData = {
      id: _id,
      firstName,
      lastName,
      email,
    };

    return res.status(200).json(updatedUserData);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const users = await userControllers.getAll();
  return res.status(200).json({
    users: users,
  });
};

export const userMiddlewares = {
  createUser,
  updateUser,
  getAllUsers,
};
