import { z } from 'zod'

export const emailSchema = z.object({
  email: z.string().email('This is not a valid email address'),
})

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  username: z.string().min(3, 'Username must be at least 3 characters long'),
  bio: z
    .string()
    .min(3, 'Bio must be at least 3 characters long')
    .max(200, 'Bio must not exceed 200 characters')
    .optional(),
  website: z.string().url('Website must be a valid URL').optional(),
  linkedin: z.string().url('Website must be a valid URL').optional(),
  github: z.string().url('Website must be a valid URL').optional(),
  youtube: z.string().url('Website must be a valid URL').optional(),
})
