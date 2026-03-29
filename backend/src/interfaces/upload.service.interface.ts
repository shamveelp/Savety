import { IUpload } from '../models/upload.model';
import { CreateUploadDto } from '../dtos/upload.dto';

export interface IUploadService {
  createUpload(userId: string, data: CreateUploadDto, files: any[]): Promise<IUpload>;
  getUserUploads(userId: string): Promise<IUpload[]>;
  getUploadById(id: string): Promise<IUpload | null>;
  updateUpload(id: string, userId: string, data: any, newFiles?: any[]): Promise<IUpload | null>;
  deleteUpload(id: string, userId: string): Promise<boolean>;
}
