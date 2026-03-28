import { Router } from 'express';
import { container } from '../../core/container';
import { IUserController } from '../../interfaces/user.controller.interface';
import { TYPES } from '../../core/types';
import { authMiddleware } from '../../middlewares/auth.middleware';
import multer from 'multer';

const router = Router();
const userController = container.get<IUserController>(TYPES.UserController);

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Profile endpoints
router.get('/profile', authMiddleware, (req, res) => userController.getProfile(req, res));
router.patch('/profile', authMiddleware, (req, res) => userController.updateProfile(req, res));
router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res) => userController.updateAvatar(req, res));
router.post('/change-password', authMiddleware, (req, res) => userController.changePassword(req, res));

export default router;
