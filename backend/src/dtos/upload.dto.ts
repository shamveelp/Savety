import { z } from 'zod';

export const CreateUploadSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(1000).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']),
});

export type CreateUploadDto = z.infer<typeof CreateUploadSchema>;
