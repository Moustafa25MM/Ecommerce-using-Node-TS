import { Router } from 'express';
import { userRoutes } from './user';
import { adminRoutes } from './admin';
import { categoryRoutes } from './category';
const router = Router();

router.use('/user', userRoutes);
router.use('/admin', adminRoutes);
router.use('/category', categoryRoutes);

export const indexRouter: Router = router;
