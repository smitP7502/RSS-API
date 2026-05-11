import { z } from 'zod';

export const RegisterMemberSchema = z.object({
    name: z.string().min(3, "Name must be 3 character long"),
    mobileNo: z.string().optional(),
    address: z.string().optional(),
    dob: z.coerce.date().optional(),
    email: z.email().optional(),
    shakhaId: z.string(),
    userName: z.string().min(6, "Username must be 6 character long"),
    password: z.string().min(6, "Password must be 6 character long")
}).strict();

export const UpdateMemberSchema = z.object({
    name: z.string().min(3, "Name must be 3 character long"),
    mobileNo: z.string().optional(),
    email: z.email().optional(),
    address: z.string().optional(),
    dob: z.coerce.date().optional(),
}).strict();

export type RegisterMember = z.infer<typeof RegisterMemberSchema>;
export type UpdateMember = z.infer<typeof UpdateMemberSchema>;