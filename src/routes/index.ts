import { Router } from 'express';
import { userRoutes } from './user';
import { adminRoutes } from './admin';
import { categoryRoutes } from './category';
import { productRoutes } from './product';
import { cartRoutes } from './cart';
import { addressRoutes } from './address';
import { wishlistRoutes } from './wishlist';
const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);
router.use('/address', addressRoutes);
router.use('/wishlist', wishlistRoutes);

export const indexRouter: Router = router;
