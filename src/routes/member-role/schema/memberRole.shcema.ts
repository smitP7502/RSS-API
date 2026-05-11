import { z } from 'zod';

export const CreateMemberRoleSchema = z.object({
    roleId: z.number(),
    memberId: z.string(),
}).strict();

export type CreateMemberRole = z.infer<typeof CreateMemberRoleSchema>;