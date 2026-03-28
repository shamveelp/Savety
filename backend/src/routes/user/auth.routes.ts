import { Router } from 'express';
import { container } from '../../core/container';
import { TYPES } from '../../core/types';
import { IAuthController } from '../../interfaces/auth.controller.interface';

const router = Router();
const authController = container.get<IAuthController>(TYPES.AuthController);

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/verify-otp', authController.verifyOTP.bind(authController));

export default router;
