import { Response } from 'express';
import { RequestWithUser } from '../interfaces/request.interface';
import { inject, injectable } from 'inversify';
import { IUserController } from '../interfaces/user.controller.interface';
import { IUserService } from '../interfaces/user.service.interface';
import { TYPES } from '../core/types';
import cloudinary from '../config/cloudinary';
import logger from '../utils/logger';
import { StatusCodes } from '../enums/statusCodes.enum';
import { ConstantMessages } from '../enums/constantMessages.enum';
import { ErrorMessages } from '../enums/errorMessages.enum';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.UserService) private userService: IUserService
  ) {}

  async getProfile(req: RequestWithUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }
      const userId = req.user.id;
      const profile = await this.userService.getProfile(userId);
      res.status(StatusCodes.OK).json(profile);
    } catch (error) {
      logger.error('Get profile error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async updateProfile(req: RequestWithUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }
      const userId = req.user.id;
      const updatedProfile = await this.userService.updateProfile(userId, req.body);
      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      logger.error('Update profile error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async updateAvatar(req: RequestWithUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }
      const userId = req.user.id;
      if (!req.file) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessages.NO_IMAGE_PROVIDED });
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
      res.status(StatusCodes.OK).json(updatedProfile);
    } catch (error) {
      logger.error('Update avatar error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async changePassword(req: RequestWithUser, res: Response): Promise<void> {
    try {
      if (!req.user?.id) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }
      const userId = req.user.id;
      await this.userService.changePassword(userId, req.body);
      res.status(StatusCodes.OK).json({ message: ConstantMessages.PASSWORD_UPDATED });
    } catch (error) {
      logger.error('Change password error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }
}
