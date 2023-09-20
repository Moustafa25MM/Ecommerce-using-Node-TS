import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { productMiddlewares } from '../middlewares/product';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  productMiddlewares.createProduct
);
router.get('/all', productMiddlewares.getAllProducts);
router.get('/:id', productMiddlewares.getProductById);

router.put(
  '/update/:id',
  authMethods.isAdminAuthorized,
  productMiddlewares.updateProduct
);

router.delete(
  '/delete/:id',
  authMethods.isAdminAuthorized,
  productMiddlewares.removeProduct
);

export const productRoutes: Router = router;
