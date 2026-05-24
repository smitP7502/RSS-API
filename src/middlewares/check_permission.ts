import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export const checkPermission = (permission: string) => async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.user?.id;

    if (req.user?.role === "ADMIN") {
        next(res);
    }

    if (!memberId) {
        throw new AppError("Unauthorized user!", 401);
    }

    console.log("memberId : ", memberId);

    const shakhaMember = await prisma.shakhaMember.findFirst({
        where: { memberId: memberId, isActive: true },
        select: {
            memberRole: {
                where: { revokedAt: null },
                select: {
                    role: {
                        select: {
                            [permission]: true,
                            isActive: true
                        }
                    }
                }
            }
        }
    });

    console.log("Shakahmember : ", shakhaMember);

    console.log("passed check");
    if (!shakhaMember) {
        console.log("passed check11");
        throw new AppError("Don't have permission to do this operation!", 403);
    }
    console.log("passed check22");

    console.log("passed check permission!");
    next();
}