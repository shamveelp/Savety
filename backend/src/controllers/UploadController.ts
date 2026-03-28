import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { IUploadService } from '../interfaces/upload.service.interface';
import { TYPES } from '../core/types';
import { CreateUploadSchema } from '../dtos/upload.dto';
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
}
