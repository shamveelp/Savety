import { injectable, inject } from 'inversify';
import cloudinary from '../config/cloudinary';
import { IUploadService } from '../interfaces/upload.service.interface';
import { IUploadRepository } from '../interfaces/upload.repository.interface';
import { TYPES } from '../core/types';
import { IUpload } from '../models/upload.model';
import { CreateUploadDto } from '../dtos/upload.dto';
import logger from '../utils/logger';

@injectable()
export class UploadService implements IUploadService {
  constructor(
    @inject(TYPES.UploadRepository) private uploadRepository: IUploadRepository
  ) {}

  async createUpload(userId: string, data: CreateUploadDto, files: any[]): Promise<IUpload> {
    logger.info(`Processing ${files.length} images for User: ${userId}`);
    
    // Cloudinary bulk upload using streams for memory storage
    const uploadPromises = files.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'savety/memories', resource_type: 'image' },
          (error, result) => {
            if (error) {
              logger.error('Cloudinary stream upload error', error);
              return reject(error);
            }
            resolve(result?.secure_url || '');
          }
        );
        stream.end(file.buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);
    logger.info(`Successfully uploaded ${imageUrls.length} images to Cloudinary`);

    return await this.uploadRepository.create({
      userId: userId as any,
      title: data.title,
      description: data.description,
      visibility: data.visibility as any,
      images: imageUrls,
    });
  }

  async getUserUploads(userId: string): Promise<IUpload[]> {
    return await this.uploadRepository.findByUserId(userId);
  }

  async getUploadById(id: string): Promise<IUpload | null> {
    return await this.uploadRepository.findById(id);
  }

  async deleteUpload(id: string, userId: string): Promise<boolean> {
    const upload = await this.uploadRepository.findById(id);
    if (!upload || upload.userId.toString() !== userId) return false;
    
    // Optional: Delete from Cloudinary too? (Skipping for now for simplicity)
    return await this.uploadRepository.delete(id);
  }
}
