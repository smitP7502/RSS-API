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
            console.log("d1");
            throw new AppError("Username or Password is wrong!", 401);
        }

        const match = await bcrypt.compare(body.password, memberCred.password);

        if (!match) {
            console.log("d2");
            throw new AppError("Username or Password is wrong!", 401);
        }

        const member = await prisma.member.findUnique({
            where: { id: memberCred.memberId }
        });


        if (!member) {
            console.log("d3");
            throw new AppError("Username or Password is wrong!", 401);
        }

        const token = jwt.sign(
            { id: memberCred.memberId, role: member.role },
            process.env.JWT_SECRET as string
        );

        sendSuccess(res, {
            token,
            member: {
                id: member.id,
                userName: memberCred.userName,
                name: member.name,
                email: member.email,
                isAdmin: member.role === "admin" ? 1 : 0
            }
        }, "Login successfully!");
    }

    static resetPassword = async (req: Request, res: Response) => {
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

        console.log(memberId);

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
            {
                id: updatedCredential.id
            },
            "Password reset successfully!"
        );
    }
}