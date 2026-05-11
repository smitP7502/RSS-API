import { NextFunction, Request, Response } from "express"
import { SystemUserRole } from "../constant/roles";

export const authorize = (role: SystemUserRole) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userRole = req.user?.role;

    if (userRole !== role) {
        res.status(403).json({
            message: "You don't have permission to do this action"
        });
        return;
    }
    next();
}
