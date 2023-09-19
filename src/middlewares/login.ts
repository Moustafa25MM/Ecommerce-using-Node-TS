import { userControllers } from '../controllers/user';
import { Request, Response } from 'express';
import { authMethods } from './auth';
import { adminControllers } from '../controllers/admin';

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userDataFromDB: any = await userControllers.getUserByEmail(email);

  if (!userDataFromDB) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const compare = await authMethods.comparePassword(
    password,
    userDataFromDB.password
  );
  if (!compare) res.status(401).json({ error: 'Invalid email or password' });
  else {
    const token = authMethods.generateJWTForUser({ id: userDataFromDB.id });

    const userData = {
      id: userDataFromDB.id,
      firstName: userDataFromDB.firstName,
      lastName: userDataFromDB.lastName,
      email: userDataFromDB.email,
    };

    res.status(200).json({ token, user: userData });
  }
};
const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const adminDataFromDB: any = await adminControllers.getAdminByEmail(email);

  if (!adminDataFromDB) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const compare = await authMethods.comparePassword(
    password,
    adminDataFromDB.password
  );
  if (!compare) res.status(401).json({ error: 'Invalid email or password' });
  else {
    const token = authMethods.generateJWTForAdmin({ id: adminDataFromDB.id });
    adminDataFromDB.active = true;
    const adminData = {
      id: adminDataFromDB.id,
      username: adminDataFromDB.firstName,
      email: adminDataFromDB.email,
      active: adminDataFromDB.active,
    };

    res.status(200).json({ token, admin: adminData });
  }
};

export const loginMethods = {
  userLogin,
  adminLogin,
};
