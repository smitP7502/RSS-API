import { MemberSystemRole } from "../generated/prisma/enums";

export interface AuthUser {
    id: string;
    role: MemberSystemRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}