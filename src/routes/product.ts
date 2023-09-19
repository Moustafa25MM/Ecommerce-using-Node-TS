import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { productMiddlewares } from '../middlewares/product';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  productMiddlewares.createProduct
);

export const productRoutes: Router = router;
