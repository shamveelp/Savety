import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { IUploadService } from '../interfaces/upload.service.interface';
import { TYPES } from '../core/types';
import { CreateUploadSchema, UpdateUploadSchema } from '../dtos/upload.dto';
import logger from '../utils/logger';

@injectable()
export class UploadController implements IUploadController {
  constructor(
    @inject(TYPES.UploadService) private uploadService: IUploadService
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
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
    } catch (error: any) {
      if (error.message === 'DUPLICATE_TITLE') {
          res.status(400).json({ message: 'A memory with this title already exists in your vault. Consider adding to the same bulk or using a different title.' });
          return;
      }
      logger.error('Upload create error:', error);
      if (error.errors) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const uploads = await this.uploadService.getUserUploads(userId);
      res.status(200).json({ uploads });
    } catch (error: any) {
      logger.error('Upload list error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async details(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const upload = await this.uploadService.getUploadById(id as string);
      
      if (!upload) {
        res.status(404).json({ message: 'Upload not found.' });
        return;
      }

      // If private, check user
      if (upload.visibility === 'private') {
        const userId = (req as any).user?.id;
        if (!userId || upload.userId.toString() !== userId.toString()) {
          res.status(403).json({ message: 'This memory is private.' });
          return;
        }
      }

      res.status(200).json({ upload });
    } catch (error: any) {
      logger.error('Upload details error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const validatedData = UpdateUploadSchema.parse(req.body);
      const newFiles = req.files as Express.Multer.File[];

      // Handle existingImages being a single string or an array
      if (validatedData.existingImages && typeof validatedData.existingImages === 'string') {
        validatedData.existingImages = [validatedData.existingImages];
      }

      const updated = await this.uploadService.updateUpload(id as string, userId as string, validatedData, newFiles);
      
      if (!updated) {
        res.status(404).json({ message: 'Memory not found.' });
        return;
      }

      res.status(200).json({ message: 'Memory refined successfully!', upload: updated });
    } catch (error: any) {
      if (error.message === 'DUPLICATE_TITLE') {
          res.status(400).json({ message: 'Another memory with this title already exists in your vault. Please use a unique title.' });
          return;
      }
      logger.error('Upload update error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      
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
    } catch (error: any) {
      logger.error('Upload remove error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async explore(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const result = await this.uploadService.getExploreUploads(page, limit);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error('Upload explore error:', error);
      res.status(400).json({ message: error.message });
    }
  }

  async toggleLike(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user.id as string;
      const upload = await this.uploadService.toggleLike(id, userId);
      if (!upload) {
        res.status(404).json({ message: 'Memory not found' });
        return;
      }
      const isLiked = upload.likes.some(likeId => likeId.toString() === userId);
      res.status(200).json({ likesCount: upload.likes.length, isLiked });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async publicProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId as string;
      const data = await this.uploadService.getPublicProfile(userId);
      res.status(200).json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUploadBySlug(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username as string;
      const slug = req.params.slug as string;
      const upload = await this.uploadService.getUploadBySlug(username, slug);
      if (!upload) {
        res.status(404).json({ message: 'Memory not found' });
        return;
      }
      res.status(200).json({ upload });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
