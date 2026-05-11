import { z } from 'zod';

export const AddRoleSchema = z.object({
    name: z.string()
}).strict();

export type AddRole = z.infer<typeof AddRoleSchema>;