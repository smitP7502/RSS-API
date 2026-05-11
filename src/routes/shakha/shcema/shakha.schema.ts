import { z } from 'zod';

export const CreateShakhaSchema = z.object({
    name: z.string().min(6),
    location: z.string().max(255),
    establishDate: z.coerce.date().optional(),
}).strict();

export const UpdateShakhaSchema = z.object({
    name: z.string().min(6),
    location: z.string().max(255),
    establishDate: z.coerce.date().optional(),
}).strict();

export type CreateShakha = z.infer<typeof CreateShakhaSchema>;
export type UpdateShakha = z.infer<typeof UpdateShakhaSchema>;