import { z } from 'zod';

export const LoginSchema = z.object({
    userName: z.string().min(6, "Username must be 6 character long"),
    password: z.string().min(6, "Password must be 6 character long")
}).strict();

export const ResetPwdSchema = z.object({
    password: z.string().min(6, "Password must be 6 character long")
}).strict();

export type Login = z.infer<typeof LoginSchema>;
export type ResetPwd = z.infer<typeof ResetPwdSchema>;