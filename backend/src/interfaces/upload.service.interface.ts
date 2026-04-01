import { IUpload } from '../models/upload.model';
import { CreateUploadDto } from '../dtos/upload.dto';

export interface IUploadService {
  createUpload(userId: string, data: CreateUploadDto, files: Express.Multer.File[]): Promise<IUpload>;
  getUserUploads(userId: string): Promise<IUpload[]>;
  getUploadById(id: string): Promise<IUpload | null>;
  updateUpload(id: string, userId: string, data: Partial<CreateUploadDto> & { existingImages?: string[] }, newFiles?: Express.Multer.File[]): Promise<IUpload | null>;
  deleteUpload(id: string, userId: string): Promise<boolean>;
  getExploreUploads(page: number, limit: number): Promise<{ uploads: IUpload[], total: number }>;
  toggleLike(uploadId: string, userId: string): Promise<IUpload | null>;
  getPublicProfile(userId: string): Promise<Record<string, unknown>>;
  getUploadBySlug(username: string, slug: string): Promise<IUpload | null>;
  toggleShare(uploadId: string, userId: string): Promise<IUpload | null>;
}
