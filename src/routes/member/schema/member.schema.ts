import { z } from 'zod';

export const RegisterMemberSchema = z.object({
    name: z.string().min(3, "Name must be 3 character long"),
    mobile: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    dob: z.coerce.date(),
    email: z.email().nullable().optional(),
    shakhaId: z.string(),
    userName: z.string().min(6, "Username must be 6 character long"),
    password: z.string().min(6, "Password must be 6 character long")
}).strict();

export const CreateRegisterMemberShakaSchema = z.object({
    name: z.string().min(3, "Name must be 3 character long"),
    mobile: z.string().optional(),
    address: z.string().optional(),
    dob: z.coerce.date().optional(),
    email: z.email().optional(),
    userName: z.string().min(6, "Username must be 6 character long"),
    password: z.string().min(6, "Password must be 6 character long")
}).strict();

export const UpdateMemberSchema = z.object({
    name: z.string().min(3, "Name must be 3 character long"),
    dob: z.coerce.date(),
    mobile: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    email: z.email().nullable().optional()
}).strict();

export type RegisterMember = z.infer<typeof RegisterMemberSchema>;
export type UpdateMember = z.infer<typeof UpdateMemberSchema>;
export type CreateRegisterMemberShaka = z.infer<typeof CreateRegisterMemberShakaSchema>;