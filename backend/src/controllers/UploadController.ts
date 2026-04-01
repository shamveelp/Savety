import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { IUploadService } from '../interfaces/upload.service.interface';
import { TYPES } from '../core/types';
import { CreateUploadSchema, UpdateUploadSchema } from '../dtos/upload.dto';
import logger from '../utils/logger';
import { RequestWithUser } from '../interfaces/request.interface';
import { ZodError } from 'zod';

@injectable()
export class UploadController implements IUploadController {
  constructor(
    @inject(TYPES.UploadService) private uploadService: IUploadService
  ) {}

  async create(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        res.status(400).json({ message: 'At least one photo is required.' });
        return;
      }

      const validatedData = CreateUploadSchema.parse(req.body);
      
      const upload = await this.uploadService.createUpload(userId, validatedData, files);
      
      res.status(201).json({ 
        message: 'Memories preserved successfully!', 
        upload 
      });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'DUPLICATE_TITLE') {
          res.status(400).json({ message: 'A memory with this title already exists in your vault. Consider adding to the same bulk or using a different title.' });
          return;
      }
      logger.error('Upload create error:', error);
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(400).json({ message: err.message });
      }
    }
  }

  async list(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const uploads = await this.uploadService.getUserUploads(userId);
      res.status(200).json({ uploads });
    } catch (error) {
      logger.error('Upload list error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  async details(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { token } = req.query;
      const upload = await this.uploadService.getUploadById(id as string);
      
      if (!upload) {
        res.status(404).json({ message: 'Upload not found.' });
        return;
      }

      const userId = req.user?.id;
      const isOwner = userId && upload.userId.toString() === userId.toString();

      // Visibility Enforcement
      if (upload.visibility === 'private') {
        if (!isOwner) {
          res.status(403).json({ message: 'This memory is private.' });
          return;
        }
      } else if (upload.visibility === 'unlisted') {
        const isTokenValid = token && upload.shareToken === token;
        if (!isOwner && !isTokenValid) {
          res.status(403).json({ message: 'Access denied. A sharing token is required for this unlisted memory.' });
          return;
        }
      }

      res.status(200).json({ upload });
    } catch (error) {
      logger.error('Upload details error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  async update(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
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
        res.status(404).json({ message: 'Memory not found.' });
        return;
      }

      res.status(200).json({ message: 'Memory refined successfully!', upload: updated });
    } catch (error) {
      const err = error as Error;
      if (err.message === 'DUPLICATE_TITLE') {
          res.status(400).json({ message: 'Another memory with this title already exists in your vault. Please use a unique title.' });
          return;
      }
      logger.error('Upload update error:', error);
      res.status(400).json({ message: err.message });
    }
  }

  async remove(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const success = await this.uploadService.deleteUpload(id as string, userId.toString());
      if (success) {
        res.status(200).json({ message: 'Memory removed.' });
      } else {
        res.status(400).json({ message: 'Failed to remove memory.' });
      }
    } catch (error) {
      logger.error('Upload remove error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  async explore(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const result = await this.uploadService.getExploreUploads(page, limit);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Upload explore error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  async toggleLike(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id as string;
      const upload = await this.uploadService.toggleLike(id, userId);
      if (!upload) {
        res.status(404).json({ message: 'Memory not found' });
        return;
      }
      const isLiked = upload.likes.some(likeId => likeId.toString() === userId);
      res.status(200).json({ likesCount: upload.likes.length, isLiked });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async publicProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const data = await this.uploadService.getPublicProfile(userId);
      res.status(200).json(data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async getUploadBySlug(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const username = req.params.username as string;
      const slug = req.params.slug as string;
      const { token } = req.query;
      const upload = await this.uploadService.getUploadBySlug(username, slug);
      
      if (!upload) {
        res.status(404).json({ message: 'Memory not found' });
        return;
      }

      const userId = req.user?.id;
      const uploadUserId = (upload.userId as unknown as { _id: { toString(): string } })._id?.toString() || upload.userId.toString();
      const isOwner = userId && uploadUserId === userId.toString();

      // Visibility Enforcement
      if (upload.visibility === 'private') {
        if (!isOwner) {
          res.status(403).json({ message: 'This memory is private.' });
          return;
        }
      } else if (upload.visibility === 'unlisted') {
        const isTokenValid = token && upload.shareToken === token;
        if (!isOwner && !isTokenValid) {
          res.status(403).json({ message: 'Access denied. A sharing token is required for this unlisted memory.' });
          return;
        }
      }

      res.status(200).json({ upload });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: err.message });
    }
  }

  async toggleShare(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const upload = await this.uploadService.toggleShare(id, userId);
      if (!upload) {
        res.status(404).json({ message: 'Memory not found or unauthorized' });
        return;
      }

      res.status(200).json({ 
        message: upload.shareEnabled ? 'Secure sharing enabled!' : 'Sharing disabled.', 
        upload 
      });
    } catch (error) {
      logger.error('Toggle share error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
}
