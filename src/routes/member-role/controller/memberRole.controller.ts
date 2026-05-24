import { Request, Response } from "express";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../lib/errors";
import { sendSuccess } from "../../../lib/response";
import { CreateMemberRole } from "../schema/memberRole.shcema";

export class MemberRoleController {
    static add = async (req: Request, res: Response) => {
        const body: CreateMemberRole = req.body;

        const shakhaMember = await prisma.shakhaMember.findFirst({
            where: {
                memberId: body.memberId
            }
        });

        if (!shakhaMember) {
            throw new AppError("Member is not part of this shakha!", 404);
        }

        const role = await prisma.role.findUnique({
            where: { id: body.roleId }
        });

        if (!role) {
            throw new AppError("Role does not exist", 404);
        }

        const memberRole = await prisma.memberRole.findFirst({
            where: {
                roleId: body.roleId,
                shakhaMemberId: shakhaMember.id
            }
        });

        if (memberRole) {
            throw new AppError("Member already has this role in this shakha", 409);
        }

        const newMemberRole = await prisma.memberRole.create({
            data: {
                roleId: body.roleId,
                shakhaMemberId: shakhaMember.id
            }
        });

        sendSuccess(res, newMemberRole, "Role successfully assigned");
    };

    static update = async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const shakhaId = req.params.shakhaId as string;
        const body: CreateMemberRole = req.body;

        if (!id) {
            throw new AppError("Member role id is required in route params", 400);
        }

        if (!shakhaId) {
            throw new AppError("Shakha id is required in route params", 400);
        }

        const shakhaMember = await prisma.shakhaMember.findFirst({
            where: {
                memberId: body.memberId,
                shakhaId: shakhaId
            }
        });

        if (!shakhaMember) {
            throw new AppError("Member is not part of this shakha!", 404);
        }

        const role = await prisma.role.findUnique({
            where: { id: body.roleId }
        });

        if (!role) {
            throw new AppError("Role does not exist", 404);
        }

        const existMemberRole = await prisma.memberRole.findUnique({
            where: { id }
        });

        if (!existMemberRole) {
            throw new AppError("Member role not found", 404);
        }

        const duplicateRole = await prisma.memberRole.findFirst({
            where: {
                roleId: body.roleId,
                memberId: shakhaMember.id,
                NOT: {
                    id: id
                }
            }
        });

        if (duplicateRole) {
            throw new AppError("Member already has this role in this shakha", 409);
        }

        const updatedMemberRole = await prisma.memberRole.update({
            where: { id },
            data: {
                roleId: body.roleId,
                memberId: shakhaMember.id
            }
        });

        sendSuccess(res, updatedMemberRole, "Role updated successfully");
    };

    static delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Id is required in route params", 400);
        }

        const exist = await prisma.memberRole.findUnique({
            where: { id }
        });

        if (!exist) {
            throw new AppError("Member role does not exist", 404);
        }

        await prisma.memberRole.delete({
            where: { id }
        });

        sendSuccess(res, null, "Member role deleted successfully!");
    };

    static getAll = async (_req: Request, res: Response) => {
        const memberRoles = await prisma.memberRole.findMany({
            include: {
                role: true,
                member: {
                    include: {
                        member: true,
                        shakha: true
                    }
                }
            }
        });

        sendSuccess(res, memberRoles, "Fetched successfully!");
    };

    static getById = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError("Id required in route params", 400);
        }

        const memberRole = await prisma.memberRole.findUnique({
            where: { id },
            include: {
                role: true,
                member: {
                    include: {
                        member: true,
                        shakha: true
                    }
                }
            }
        });

        if (!memberRole) {
            throw new AppError("Member role not found!", 404);
        }

        sendSuccess(res, memberRole, "Member role fetched successfully!");
    };
}