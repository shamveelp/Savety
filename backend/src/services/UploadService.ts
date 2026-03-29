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

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

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

    const slug = this.generateSlug(data.title);

    const duplicate = await this.uploadRepository.findByUserIdAndSlug(userId, slug);
    if (duplicate) {
        throw new Error('DUPLICATE_TITLE');
    }

    return await this.uploadRepository.create({
      userId: userId as any,
      title: data.title,
      description: data.description,
      visibility: data.visibility as any,
      images: imageUrls,
      slug: slug
    });
  }

  async getUserUploads(userId: string): Promise<IUpload[]> {
    return await this.uploadRepository.findByUserId(userId);
  }

  async getUploadById(id: string): Promise<IUpload | null> {
    return await this.uploadRepository.findById(id);
  }

  async updateUpload(id: string, userId: string, data: any, newFiles?: any[]): Promise<IUpload | null> {
    const existing = await this.uploadRepository.findById(id);
    if (!existing || existing.userId.toString() !== userId) {
      throw new Error('Forbidden or not found');
    }

    let updatedImages = [...(data.existingImages || [])];

    // If there ARE new files, upload them
    if (newFiles && newFiles.length > 0) {
      const uploadPromises = newFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'savety/memories', resource_type: 'image' },
            (error, result) => {
              if (error) return reject(error);
              resolve(result?.secure_url || '');
            }
          );
          stream.end(file.buffer);
        });
      });
      const newUrls = await Promise.all(uploadPromises);
      updatedImages = [...updatedImages, ...newUrls];
    }

    const updateData: any = {
      title: data.title || existing.title,
      description: data.description !== undefined ? data.description : existing.description,
      visibility: data.visibility || existing.visibility,
      images: updatedImages,
    };

    if (!existing.slug || (data.title && data.title !== existing.title)) {
        const newSlug = this.generateSlug(data.title || existing.title);
        
        // Check if this new slug is taken by ANOTHER upload by the same user
        const duplicate = await this.uploadRepository.findByUserIdAndSlug(userId, newSlug);
        if (duplicate && duplicate._id.toString() !== id) {
            throw new Error('DUPLICATE_TITLE');
        }
        
        updateData.slug = newSlug;
    }

    return await this.uploadRepository.update(id, updateData);
  }

  async deleteUpload(id: string, userId: string): Promise<boolean> {
    const upload = await this.uploadRepository.findById(id);
    if (!upload || upload.userId.toString() !== userId) return false;
    return await this.uploadRepository.delete(id);
  }

  async getExploreUploads(page: number, limit: number): Promise<{ uploads: IUpload[], total: number }> {
    return await this.uploadRepository.findPublic(page, limit);
  }

  async toggleLike(uploadId: string, userId: string): Promise<IUpload | null> {
    return await this.uploadRepository.toggleLike(uploadId, userId);
  }

  async getPublicProfile(userId: string): Promise<any> {
    const uploads = await this.uploadRepository.findPublicByUserId(userId);
    return { uploads };
  }

  async getUploadBySlug(username: string, slug: string): Promise<IUpload | null> {
    return await this.uploadRepository.findByUsernameAndSlug(username, slug);
  }
}
