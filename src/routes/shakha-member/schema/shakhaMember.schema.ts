import { z } from 'zod';

// export const AddShakhaMemberShcema = z.object({
//     memberId: z.string(),
//     shakhaId: z.string(),
//     isActive: z.boolean().default(true),
//     joiningDate: z.date().optional(),
//     leavingDate: z.date().optional(),
// }).strict();

// export const UpdateShakhaMemberShcema = z.object({
//     memberId: z.string(),
//     shakhaId: z.string(),
//     isActive: z.boolean().default(true),
//     joiningDate: z.date().nullable(),
//     leavingDate: z.date().nullable(),
// }).strict();

export const AssignMemberRoleSchema = z.object({
    shakhaMemberId: z.string()
}).strict();

export type AssignMemberRole = z.infer<typeof AssignMemberRoleSchema>;
// export type AddShakhaMember = z.infer<typeof AddShakhaMemberShcema>;
// export type UpdateShakhaMember = z.infer<typeof UpdateShakhaMemberShcema>;