import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { categoryMiddlewares } from '../middlewares/category';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  categoryMiddlewares.createCategory
);
router.get(
  '/all',
  authMethods.isAdminAuthorized,
  categoryMiddlewares.getAllCategories
);
router.patch(
  '/update/:id',
  authMethods.isAdminAuthorized,
  categoryMiddlewares.updateCategory
);
router.delete(
  '/delete/:id',
  authMethods.isAdminAuthorized,
  categoryMiddlewares.removeCategory
);

export const categoryRoutes: Router = router;
