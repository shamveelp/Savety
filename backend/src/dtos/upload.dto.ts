import { z } from 'zod';

export const CreateUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

export const UpdateUploadSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  existingImages: z.union([z.string(), z.array(z.string())]).optional(),
});

export type CreateUploadDto = z.infer<typeof CreateUploadSchema>;
export type UpdateUploadDto = z.infer<typeof UpdateUploadSchema>;
