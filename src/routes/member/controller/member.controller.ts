import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { AppError } from '../../../lib/errors';
import prisma from '../../../lib/prisma';
import { sendSuccess } from '../../../lib/response';
import { CreateRegisterMemberShaka, RegisterMember, UpdateMember } from '../schema/member.schema';
import filterData from '../../../utils/filter_data';
import { email } from 'zod';

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

        const newMember = await prisma.$transaction(async (tx) => {
            const member = await prisma.member.create({
                data: {
                    name: body.name,
                    mobile: body.mobile,
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

            return member;
        });

        sendSuccess(res, filterData(newMember), "Registered successfully!");
    }

    static getAll = async (req: Request, res: Response) => {
        const members = await prisma.member.findMany({ where: { isActive: true } });

        sendSuccess(res, members, "Members fetched successfully!");
    }

    static getByShakhaId = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Id is required", 400);
        }

        const shakhaExist = await prisma.shakha.findUnique({
            where: { id, isActive: true }
        });

        if (!shakhaExist) {
            throw new AppError("Shakha does not exist!", 404);
        }

        const shakhaMembers = await prisma.shakhaMember.findMany({
            where: { shakhaId: id, isActive: true },
            select: {
                member: true,
            },
        });

        const members = shakhaMembers.map(item => item.member);

        const data = members.map(e => filterData(e));

        sendSuccess(res, data, "Members fetched successfully!");
    }

    static updateMember = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const body: UpdateMember = req.body;

        if (!id) {
            throw new AppError("Id is required", 400);
        }

        const member = await prisma.member.findMany({
            where: { id, isActive: true }
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
                mobile: body.mobile,
                email: body.email,
            }
        });

        sendSuccess(res, filterData(updatedMember), "Member updated successfully");
    }

    static deleteMember = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Id is required", 400);
        }

        const memberExist = await prisma.member.findUnique({
            where: { id }
        });

        if (!memberExist) {
            throw new AppError("Member does not exist!", 404);
        }

        const roles = await prisma.memberRole.findMany({
            where: { shakhaMemberId: id, isActive: true },
            select: { id: true }
        });

        const ids = roles.map(e => e.id);

        await prisma.$transaction([
            prisma.memberRole.updateMany({
                where: { id: { in: ids }, revokedAt: null },
                data: {
                    revokedAt: new Date(),
                }
            }),

            prisma.shakhaMember.updateMany({
                where: { memberId: id, isActive: true },
                data: {
                    isActive: false,
                }
            }),

            prisma.member.updateMany({
                where: { id: id, isActive: true },
                data: {
                    isActive: false,
                }
            }),
        ]);

        sendSuccess(res, null, "Member deleted successfully!");
    }

    static getMemberData = async (req: Request, res: Response) => {
        const memberId = req.user?.id;

        const shakhaMember = await prisma.shakhaMember.findFirst({
            where: { memberId, isActive: true },
            select: {
                member: {
                    select: {
                        id: true,
                        name: true,
                        dob: true,
                        email: true,
                        mobile: true,
                        address: true,
                    }
                },
                shakha: {
                    select: { name: true }
                },
                memberRole: {
                    where: { revokedAt: null },
                    select: {
                        role: true,
                    },
                    take: 1,
                },
            }
        });

        if (!shakhaMember) {
            throw new AppError("You are not part of any shakha", 404);
        }

        const data = {
            id: shakhaMember.member.id,
            name: shakhaMember.member.name,
            dob: shakhaMember.member.dob,
            email: shakhaMember.member.email,
            mobile: shakhaMember.member.mobile,
            address: shakhaMember.member.address,
            shakhaName: shakhaMember.shakha.name,
            role: shakhaMember.memberRole[0]?.role.name ?? null,
        };

        sendSuccess(res, data, "Data fetched successfully!");
    }

    static updateMemberData = async (req: Request, res: Response) => {
        const memberId = req.params.id as string;
        const data: UpdateMember = req.body;

        if (!memberId) {
            throw new AppError("Member not found", 404);
        }

        const member = await prisma.member.findUnique({
            where: { id: memberId, isActive: true }
        });

        if (!member) {
            throw new AppError("Member does not exist!", 404);
        }

        const updatedMember = await prisma.member.update({
            where: { id: memberId, isActive: true },
            data: {
                name: data.name,
                mobile: data.mobile,
                dob: data.dob === undefined ? null : new Date(data.dob),
                email: data.email,
                address: data.address,
            }
        });

        sendSuccess(res, filterData(updatedMember), "Data updated successfully!");
    }

    static createRegisterMemberShaka = async (req: Request, res: Response) => {
        const body: CreateRegisterMemberShaka = req.body;
        const { shakhaId, memberId } = res.locals;

        const shakhaMemberData = await prisma.shakhaMember.findFirst({
            where: { memberId: memberId, isActive: true },
        });

        if (!shakhaMemberData) {
            throw new AppError("Member is not part of shakha", 404);
        }

        const result = await prisma.$transaction(async (tx) => {
            const hashedPwd = await bcrypt.hash(body.password, 10);

            const member = await tx.member.create({
                data: {
                    name: body.name,
                    email: body.email,
                    address: body.email,
                    mobile: body.mobile,
                }
            });

            const shakhaMember = await tx.shakhaMember.create({
                data: {
                    shakhaId: shakhaId,
                    memberId: member.id
                }
            });

            const memberCred = await tx.memberCredential.create({
                data: {
                    userName: body.userName,
                    password: hashedPwd,
                    memberId: member.id
                }
            });

            return { member, shakhaMember, memberCred };
        });

        var { member, shakhaMember, memberCred } = result;

        sendSuccess(res, {
            member, shakhaMember, memberCred
        });
    }
}