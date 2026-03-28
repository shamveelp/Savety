import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUserController } from '../interfaces/user.controller.interface';
import { IUserService } from '../interfaces/user.service.interface';
import { TYPES } from '../core/types';
import cloudinary from '../config/cloudinary';
import logger from '../utils/logger';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService
  ) {}

  async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const profile = await this.userService.getProfile(userId);
      res.status(200).json(profile);
    } catch (error: any) {
      logger.error('Get profile error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      const updatedProfile = await this.userService.updateProfile(userId, req.body);
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      logger.error('Update profile error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async updateAvatar(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      if (!req.file) {
        res.status(400).json({ message: 'No image provided.' });
        return;
      }

      // Upload to Cloudinary
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'savety_profiles',
        public_id: `avatar_${userId}`,
        overwrite: true,
      });

      const updatedProfile = await this.userService.updateAvatar(userId, result.secure_url);
      res.status(200).json(updatedProfile);
    } catch (error: any) {
      logger.error('Update avatar error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user.id;
      await this.userService.changePassword(userId, req.body);
      res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error: any) {
      logger.error('Change password error:', error);
      res.status(400).json({ message: error.message });
    }
  }
}
