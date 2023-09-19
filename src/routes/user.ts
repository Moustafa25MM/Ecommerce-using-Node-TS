import { Router } from 'express';
import { userMiddlewares } from '../middlewares/user';
import { loginMethods } from '../middlewares/login';
import { authMethods } from '../middlewares/auth';

const router = Router();

router.use('/login', loginMethods.userLogin);
router.post('/register', userMiddlewares.createUser);
router.patch(
  '/update/:id',
  authMethods.isAuthorized,
  userMiddlewares.updateUser
);
router.get('/all', authMethods.isAuthorized, userMiddlewares.getAllUsers);
export const userRoutes: Router = router;
