import { NextFunction, Request, Response } from "express";
import { AppError } from "../lib/errors";
import prisma from "../lib/prisma";

export const getMemberAndShakahId = async (req: Request, res: Response, next: NextFunction) => {
    const memberId = req.user?.id;

    if (!memberId) {
        throw new AppError("Unauthorized access!", 404);
    }

    const shakhaMember = await prisma.shakhaMember.findFirst({
        where: { memberId: memberId, isActive: true }
    });

    res.locals.shakhaId = shakhaMember?.shakhaId;
    res.locals.memberId = memberId;


    console.log("passed check ids!");
    next();
}