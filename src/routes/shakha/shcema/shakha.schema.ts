import { z } from 'zod';
import { ShakhaType } from '../../../generated/prisma/enums';

export const CreateShakhaSchema = z.object({
    name: z.string().min(6),
    location: z.string().max(255),
    establishDate: z.coerce.date().optional(),
    shakhaType: z.enum(ShakhaType).optional(),
    timing: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .transform((timeStr) => new Date(`1970-01-01T${timeStr}:00Z`))
        .optional(),
    locationLat: z.string().optional(),
    locationLong: z.string().optional(),
}).strict();

export const UpdateShakhaSchema = z.object({
    name: z.string().min(6),
    location: z.string().max(255),
    establishDate: z.coerce.date().optional(),
    shakhaType: z.enum(ShakhaType).optional(),
    timing: z.string()
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Use HH:mm format")
        .transform((timeStr) => new Date(`1970-01-01T${timeStr}:00Z`))
        .optional(),
    locationLat: z.string().optional(),
    locationLong: z.string().optional(),
}).strict();

export type CreateShakha = z.infer<typeof CreateShakhaSchema>;
export type UpdateShakha = z.infer<typeof UpdateShakhaSchema>;