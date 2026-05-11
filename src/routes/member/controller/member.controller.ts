import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { AppError } from '../../../lib/errors';
import prisma from '../../../lib/prisma';
import { sendSuccess } from '../../../lib/response';
import { RegisterMember, UpdateMember } from '../schema/member.schema';

export class MemberController {
    static register = async (req: Request, res: Response) => {
        const body: RegisterMember = req.body;

        const shakha = await prisma.shakha.findUnique({
            where: { id: body.shakhaId }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        const userNameExist = await prisma.memberCredential.findUnique({
            where: { userName: body.userName }
        });

        if (userNameExist) {
            throw new AppError("Username already exists!", 409);
        }

        const member = await prisma.member.create({
            data: {
                name: body.name,
                mobile: body.mobileNo,
                email: body.email,
                dob: body.dob === undefined ? null : new Date(body.dob),
                address: body.address
            }
        });

        const hashedPwd = await bcrypt.hash(body.password, 10);

        await prisma.memberCredential.create({
            data: {
                userName: body.userName,
                password: hashedPwd,
                memberId: member.id,
            }
        });

        await prisma.shakhaMember.create({
            data: {
                shakhaId: shakha.id,
                memberId: member.id,
            }
        });

        sendSuccess(res, member, "Registered successfully!");
    }

    static getAll = async (req: Request, res: Response) => {
        const members = await prisma.member.findMany();

        sendSuccess(res, members, "Members fetched successfully!");
    }

    static getByShakhaId = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Id is required", 400);
        }

        const shakhaExist = await prisma.shakha.findUnique({
            where: { id }
        });

        if (!shakhaExist) {
            throw new AppError("Shakha does not exist!", 404);
        }

        const shakhaMembers = await prisma.shakhaMember.findMany({
            where: { shakhaId: id },
            select: {
                member: true,
            },
        });

        const members = shakhaMembers.map(item => item.member);

        sendSuccess(res, members, "Members fetched successfully!");
    }

    static updateMember = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const body: UpdateMember = req.body;

        if (!id) {
            throw new AppError("Id is required", 400);
        }

        const member = await prisma.member.findUnique({
            where: { id }
        });

        if (!member) {
            throw new AppError("Member not found", 404);
        }

        const updatedMember = await prisma.member.update({
            where: { id },
            data: {
                name: body.name,
                address: body.address,
                dob: body.dob === undefined ? null : new Date(body.dob),
                mobile: body.mobileNo,
                email: body.email,
            }
        });

        const { createdAt, updatedAt, ...data } = updatedMember;

        sendSuccess(res, data, "Member updated successfully");
    }
}