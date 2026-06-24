import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { IUploadService } from '../interfaces/upload.service.interface';
import { TYPES } from '../core/types';
import { CreateUploadSchema, UpdateUploadSchema } from '../dtos/upload.dto';
import logger from '../utils/logger';
import { RequestWithUser } from '../interfaces/request.interface';
import { ZodError } from 'zod';
import { StatusCodes } from '../enums/statusCodes.enum';
import { ConstantMessages } from '../enums/constantMessages.enum';
import { ErrorMessages } from '../enums/errorMessages.enum';

@injectable()
export class UploadController implements IUploadController {
  constructor(
    @inject(TYPES.UploadService) private uploadService: IUploadService
  ) {}

  async create(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessages.AT_LEAST_ONE_PHOTO });
        return;
      }

      const validatedData = CreateUploadSchema.parse(req.body);
      
      const upload = await this.uploadService.createUpload(userId, validatedData, files);
      
      res.status(StatusCodes.CREATED).json({ 
        message: ConstantMessages.MEMORIES_PRESERVED, 
        upload 
      });
    } catch (error) {
      const err = error as Error;
      if (err.message === ErrorMessages.DUPLICATE_TITLE) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessages.DUPLICATE_TITLE_CREATE });
          return;
      }
      logger.error('Upload create error:', error);
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.issues });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
  }

  async list(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }

      const uploads = await this.uploadService.getUserUploads(userId);
      res.status(StatusCodes.OK).json({ uploads });
    } catch (error) {
      logger.error('Upload list error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async details(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { token } = req.query;
      const upload = await this.uploadService.getUploadById(id as string);
      
      if (!upload) {
        res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.UPLOAD_NOT_FOUND });
        return;
      }

      const userId = req.user?.id;
      const isOwner = userId && upload.userId.toString() === userId.toString();

      // Visibility Enforcement
      if (upload.visibility === 'private') {
        if (!isOwner) {
          res.status(StatusCodes.FORBIDDEN).json({ message: ErrorMessages.MEMORY_PRIVATE });
          return;
        }
      } else if (upload.visibility === 'unlisted') {
        const isTokenValid = token && upload.shareToken === token;
        if (!isOwner && !isTokenValid) {
          res.status(StatusCodes.FORBIDDEN).json({ message: ErrorMessages.ACCESS_DENIED_UNLISTED });
          return;
        }
      }

      res.status(StatusCodes.OK).json({ upload });
    } catch (error) {
      logger.error('Upload details error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async update(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }

      const validatedData = UpdateUploadSchema.parse(req.body);
      const newFiles = req.files as Express.Multer.File[];

      // Handle existingImages being a single string or an array
      const dataToUpdate = {
        ...validatedData,
        existingImages: Array.isArray(validatedData.existingImages) 
          ? validatedData.existingImages 
          : (validatedData.existingImages ? [validatedData.existingImages] : undefined)
      };

      const updated = await this.uploadService.updateUpload(id as string, userId as string, dataToUpdate, newFiles);
      
      if (!updated) {
        res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.MEMORY_NOT_FOUND_PERIOD });
        return;
      }

      res.status(StatusCodes.OK).json({ message: ConstantMessages.MEMORY_REFINED, upload: updated });
    } catch (error) {
      const err = error as Error;
      if (err.message === ErrorMessages.DUPLICATE_TITLE) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessages.DUPLICATE_TITLE_UPDATE });
          return;
      }
      logger.error('Upload update error:', error);
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async remove(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }

      const success = await this.uploadService.deleteUpload(id as string, userId.toString());
      if (success) {
        res.status(StatusCodes.OK).json({ message: ConstantMessages.MEMORY_REMOVED });
      } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: ErrorMessages.FAILED_TO_REMOVE_MEMORY });
      }
    } catch (error) {
      logger.error('Upload remove error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async explore(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const result = await this.uploadService.getExploreUploads(page, limit);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      logger.error('Upload explore error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async toggleLike(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id as string;
      const upload = await this.uploadService.toggleLike(id, userId);
      if (!upload) {
        res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.MEMORY_NOT_FOUND });
        return;
      }
      const isLiked = upload.likes.some(likeId => likeId.toString() === userId);
      res.status(StatusCodes.OK).json({ likesCount: upload.likes.length, isLiked });
    } catch (error) {
      const err = error as Error;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async publicProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const data = await this.uploadService.getPublicProfile(userId);
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async getUploadBySlug(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const username = req.params.username as string;
      const slug = req.params.slug as string;
      const { token } = req.query;
      const upload = await this.uploadService.getUploadBySlug(username, slug);
      
      if (!upload) {
        res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.MEMORY_NOT_FOUND });
        return;
      }

      const userId = req.user?.id;
      const uploadUserId = (upload.userId as unknown as { _id: { toString(): string } })._id?.toString() || upload.userId.toString();
      const isOwner = userId && uploadUserId === userId.toString();

      // Visibility Enforcement
      if (upload.visibility === 'private') {
        if (!isOwner) {
          res.status(StatusCodes.FORBIDDEN).json({ message: ErrorMessages.MEMORY_PRIVATE });
          return;
        }
      } else if (upload.visibility === 'unlisted') {
        const isTokenValid = token && upload.shareToken === token;
        if (!isOwner && !isTokenValid) {
          res.status(StatusCodes.FORBIDDEN).json({ message: ErrorMessages.ACCESS_DENIED_UNLISTED });
          return;
        }
      }

      res.status(StatusCodes.OK).json({ upload });
    } catch (error) {
      const err = error as Error;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
  }

  async toggleShare(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: ErrorMessages.UNAUTHORIZED });
        return;
      }

      const upload = await this.uploadService.toggleShare(id, userId);
      if (!upload) {
        res.status(StatusCodes.NOT_FOUND).json({ message: ErrorMessages.MEMORY_NOT_FOUND_UNAUTHORIZED });
        return;
      }

      res.status(StatusCodes.OK).json({ 
        message: upload.shareEnabled ? ConstantMessages.SECURE_SHARING_ENABLED : ConstantMessages.SHARING_DISABLED, 
        upload 
      });
    } catch (error) {
      logger.error('Toggle share error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }
}
