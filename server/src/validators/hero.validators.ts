import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  github: z.string().max(100).optional(),
  twitter: z.string().max(100).optional(),
  linkedin: z.string().max(100).optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const heroQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  skill: z.string().optional(),
  sortBy: z.enum(['level', 'xp', 'achievements', 'impact', 'newest']).optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
