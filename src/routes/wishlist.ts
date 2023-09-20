import { Router } from 'express';
import { authMethods } from '../middlewares/auth';
import { wishlistMiddlewares } from '../middlewares/wishlist';

const router: Router = Router();

router.post(
  '/add',
  authMethods.isUserAuthorized,
  wishlistMiddlewares.addProductToWishlist
);
router.post(
  '/product/remove',
  authMethods.isUserAuthorized,
  wishlistMiddlewares.removeProductFromWishlist
);
router.get(
  '/user',
  authMethods.isUserAuthorized,
  wishlistMiddlewares.getWishlistByUserId
);
router.delete(
  '/delete',
  authMethods.isUserAuthorized,
  wishlistMiddlewares.removeWishlist
);
export const wishlistRoutes: Router = router;
