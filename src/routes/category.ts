import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { categoryMiddlewares } from '../middlewares/category';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  categoryMiddlewares.createCategory
);

export const categoryRoutes: Router = router;
