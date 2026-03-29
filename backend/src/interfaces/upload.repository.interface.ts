import { IUpload } from '../models/upload.model';

export interface IUploadRepository {
  create(data: Partial<IUpload>): Promise<IUpload>;
  findById(id: string): Promise<IUpload | null>;
  findByUserId(userId: string): Promise<IUpload[]>;
  update(id: string, data: Partial<IUpload>): Promise<IUpload | null>;
  delete(id: string): Promise<boolean>;
  findPublic(page: number, limit: number): Promise<{ uploads: IUpload[], total: number }>;
  toggleLike(uploadId: string, userId: string): Promise<IUpload | null>;
  findPublicByUserId(userId: string): Promise<IUpload[]>;
  findByUsernameAndSlug(username: string, slug: string): Promise<IUpload | null>;
  findByUserIdAndSlug(userId: string, slug: string): Promise<IUpload | null>;
}
