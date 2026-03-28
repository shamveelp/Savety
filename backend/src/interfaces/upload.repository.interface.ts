import { IUpload } from '../models/upload.model';

export interface IUploadRepository {
  create(data: Partial<IUpload>): Promise<IUpload>;
  findById(id: string): Promise<IUpload | null>;
  findByUserId(userId: string): Promise<IUpload[]>;
  update(id: string, data: Partial<IUpload>): Promise<IUpload | null>;
  delete(id: string): Promise<boolean>;
}
