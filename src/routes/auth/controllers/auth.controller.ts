import "dotenv/config";
import { Request, Response } from "express";
import { Login, ResetPwd } from "../schema/auth.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../../lib/errors";
import prisma from "../../../lib/prisma";
import { sendSuccess } from "../../../lib/response";

export class AuthController {
    static login = async (req: Request, res: Response) => {
        const body: Login = req.body;

        const memberCred = await prisma.memberCredential.findUnique({
            where: { userName: body.userName }
        });

        if (!memberCred) {
            throw new AppError("Username or Password is wrong!", 401);
        }

        const match = await bcrypt.compare(body.password, memberCred.password);

        if (!match) {
            throw new AppError("Username or Password is wrong!", 401);
        }
        const shakhaMember = await prisma.shakhaMember.findFirst({
            where: { isActive: true, memberId: memberCred.memberId },
        });

        const member = await prisma.member.findFirst({
            where: { id: memberCred.memberId, isActive: true }
        });

        if (!shakhaMember || !member) {
            throw new AppError("Username or Password is wrong!", 401);
        }

        const token = jwt.sign(
            { id: memberCred.memberId, role: member.systemRole },
            process.env.JWT_SECRET as string
        );

        sendSuccess(res, {
            token,
            member: {
                id: member.id,
                shakhaId: shakhaMember.shakhaId,
                userName: memberCred.userName,
                name: member.name,
                email: member.email,
                isAdmin: member.systemRole === "ADMIN" ? 1 : 0,
                firstLogin: memberCred.firstLogin
            }
        }, "Login successfully!");
    }

    static changePassword = async (req: Request, res: Response) => {
        const { password } = req.body as ResetPwd;

        const memberId = req.user?.id;

        if (!memberId) {
            throw new AppError("Unauthorized!", 401);
        }

        const memberCred =
            await prisma.memberCredential.findUnique({
                where: {
                    memberId: memberId
                }
            });

        if (!memberCred) {
            throw new AppError(
                "Member credential not found!",
                404
            );
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const updatedCredential =
            await prisma.memberCredential.update({
                where: {
                    memberId
                },
                data: {
                    password: hashedPassword,
                    firstLogin: false
                }
            });

        sendSuccess(
            res,
            null,
            "Password changed successfully!"
        );
    }

    static reset = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Member id is required", 400);
        }

        const { password } = req.body as ResetPwd;

        const memberCred =
            await prisma.memberCredential.findUnique({
                where: {
                    memberId: id
                }
            });

        if (!memberCred) {
            throw new AppError(
                "Member credential not found!",
                404
            );
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const updatedCredential =
            await prisma.memberCredential.update({
                where: {
                    memberId: id
                },
                data: {
                    password: hashedPassword,
                    firstLogin: true
                }
            });

        sendSuccess(
            res,
            null,
            "Password reset successfully!"
        );
    }
}