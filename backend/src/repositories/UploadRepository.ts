import { injectable } from 'inversify';
import mongoose from 'mongoose';
import Upload, { IUpload } from '../models/upload.model';
import { IUploadRepository } from '../interfaces/upload.repository.interface';

@injectable()
export class UploadRepository implements IUploadRepository {
  async create(data: Partial<IUpload>): Promise<IUpload> {
    return await Upload.create(data);
  }

  async findById(id: string): Promise<IUpload | null> {
    return await Upload.findById(id).populate('userId', 'username email');
  }

  async findByUserId(userId: string): Promise<IUpload[]> {
    return await Upload.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
  }

  async update(id: string, data: Partial<IUpload>): Promise<IUpload | null> {
    return await Upload.findByIdAndUpdate(id, data, { new: true }).populate('userId', 'username email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Upload.findByIdAndDelete(id);
    return !!result;
  }

  async findPublic(page: number, limit: number): Promise<{ uploads: IUpload[], total: number }> {
    const skip = (page - 1) * limit;
    const [uploads, total] = await Promise.all([
      Upload.find({ visibility: 'public' })
        .populate('userId', 'username email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Upload.countDocuments({ visibility: 'public' })
    ]);
    return { uploads, total };
  }

  async toggleLike(uploadId: string, userId: string): Promise<IUpload | null> {
    const upload = await Upload.findById(uploadId);
    if (!upload) return null;
    
    // Map existing likes to strings for accurate comparison
    const likeStrings = upload.likes.map(id => id.toString());
    const index = likeStrings.indexOf(userId);
    
    if (index === -1) {
      upload.likes.push(userId as any);
    } else {
      upload.likes.splice(index, 1);
    }
    
    return await upload.save();
  }

  async findPublicByUserId(userId: string): Promise<IUpload[]> {
    return await Upload.find({ userId, visibility: 'public' })
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');
  }

  async findByUsernameAndSlug(username: string, slug: string): Promise<IUpload | null> {
    // Try by slug first
    let upload = await Upload.findOne({ slug })
      .populate({
        path: 'userId',
        match: { username: username }
      });
    
    // Fallback: If not found by slug, maybe slug IS the ID
    if (!upload || !upload.userId) {
        if (mongoose.Types.ObjectId.isValid(slug)) {
            upload = await Upload.findById(slug).populate('userId', 'username email');
            // Ensure username matches if provided (extra safety)
            if (upload && (upload.userId as any).username !== username) {
                return null;
            }
        } else {
            return null;
        }
    }
    
    return upload;
  }

  async findByUserIdAndSlug(userId: string, slug: string): Promise<IUpload | null> {
    return await Upload.findOne({ userId, slug });
  }
}
