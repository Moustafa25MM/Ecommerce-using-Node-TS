import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { productVariationMiddlewares as pv } from '../middlewares/productVariation';

const router: Router = Router();

router.post(
  '/create',
  authMethods.isAdminAuthorized,
  pv.createProductVariation
);
router.get('/all', pv.getAllProductVariations);
router.get('/:id', pv.getProductVariationById);
router.get('/product/:productId', pv.getVariationsByProductId);
router.put(
  '/update/:id',
  authMethods.isAdminAuthorized,
  pv.updateProductVariation
);
router.delete(
  '/delete/:id',
  authMethods.isAdminAuthorized,
  pv.removeProductVariation
);

export const productVariationRoutes: Router = router;
