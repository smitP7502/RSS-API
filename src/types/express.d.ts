
export interface AuthUser {
    id: string;
    role: SystemUserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}