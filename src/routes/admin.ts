import { Router } from 'express';
import { loginMethods } from '../middlewares/login';
import { authMethods } from '../middlewares/auth';
import { adminMiddlewares } from '../middlewares/admin';

const router = Router();

router.use('/login', loginMethods.adminLogin);
router.post('/create', adminMiddlewares.createAdmin);
router.get(
  '/all',
  authMethods.isAdminAuthorized,
  adminMiddlewares.getAllAdmins
);

export const adminRoutes: Router = router;
