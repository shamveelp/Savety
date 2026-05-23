import type { User } from './user';

export interface Upload {
  _id: string;
  userId: User;
  title: string;
  description?: string;
  images: string[];
  imagesMeta?: {
    url: string;
    size: number;
    width: number;
    height: number;
  }[];
  likes: string[];
  likesCount?: number;
  isLiked?: boolean;
  visibility: 'public' | 'private' | 'unlisted';
  slug: string;
  shareEnabled?: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadResponse {
  uploads: Upload[];
  pagination?: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

export interface ToggleLikeResponse {
  likesCount: number;
  isLiked: boolean;
}
