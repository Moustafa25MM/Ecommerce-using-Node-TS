import { Router } from 'express';
import { userRoutes } from './user';
import { adminRoutes } from './admin';
import { categoryRoutes } from './category';
import { productRoutes } from './product';
const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/category', categoryRoutes);
router.use('/product', productRoutes);

export const indexRouter: Router = router;
