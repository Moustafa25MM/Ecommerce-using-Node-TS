import { Router } from 'express';
import { userMiddlewares } from '../middlewares/user';
import { loginMethods } from '../middlewares/login';
import { authMethods } from '../middlewares/auth';
import { userPicUpload } from '../middlewares/imagesUpload';
const router = Router();

router.post(
  '/register',
  userPicUpload.single('profilePicture'),
  userMiddlewares.createUser
);
router.use('/login', loginMethods.userLogin);
router.patch(
  '/update/:id',
  userPicUpload.single('profilePicture'),
  authMethods.isUserAuthorized,
  userMiddlewares.updateUser
);
router.get('/all', authMethods.isAdminAuthorized, userMiddlewares.getAllUsers);
export const userRoutes: Router = router;
