import mongoose, { Schema, Document } from 'mongoose';

export interface IUpload extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  visibility: 'public' | 'private' | 'unlisted';
  images: string[]; // Cloudinary URLs
  createdAt: Date;
  updatedAt: Date;
}

const UploadSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  visibility: { 
    type: String, 
    enum: ['public', 'private', 'unlisted'], 
    default: 'private' 
  },
  images: [{ type: String, required: true }],
}, {
  timestamps: true
});

export default mongoose.model<IUpload>('Upload', UploadSchema);
