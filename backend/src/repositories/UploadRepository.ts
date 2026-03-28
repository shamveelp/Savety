import { injectable } from 'inversify';
import Upload, { IUpload } from '../models/upload.model';
import { IUploadRepository } from '../interfaces/upload.repository.interface';

@injectable()
export class UploadRepository implements IUploadRepository {
  async create(data: Partial<IUpload>): Promise<IUpload> {
    return await Upload.create(data);
  }

  async findById(id: string): Promise<IUpload | null> {
    return await Upload.findById(id);
  }

  async findByUserId(userId: string): Promise<IUpload[]> {
    return await Upload.find({ userId }).sort({ createdAt: -1 });
  }

  async update(id: string, data: Partial<IUpload>): Promise<IUpload | null> {
    return await Upload.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Upload.findByIdAndDelete(id);
    return !!result;
  }
}
