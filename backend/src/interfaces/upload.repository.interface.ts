import { IUpload } from '../models/upload.model';
import { IBaseRepository } from './base.repository.interface';

export interface IUploadRepository extends IBaseRepository<IUpload> {
  findByUserId(userId: string): Promise<IUpload[]>;
  findPublic(page: number, limit: number): Promise<{ uploads: IUpload[], total: number }>;
  toggleLike(uploadId: string, userId: string): Promise<IUpload | null>;
  findPublicByUserId(userId: string): Promise<IUpload[]>;
  findByUsernameAndSlug(username: string, slug: string): Promise<IUpload | null>;
  findByUserIdAndSlug(userId: string, slug: string): Promise<IUpload | null>;
}
