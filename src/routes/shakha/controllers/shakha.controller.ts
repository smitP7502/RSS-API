import { Request, Response } from "express";
import { CreateShakha, UpdateShakha, UpdateShakhaSchema } from "../shcema/shakha.schema";
import { AppError } from "../../../lib/errors";
import prisma from "../../../lib/prisma";
import { sendSuccess } from "../../../lib/response";
import filterData from "../../../utils/filter_data";

export class ShakhaController {
    static get = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: id, isActive: true }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        sendSuccess(res, filterData(shakha), "Successful");
    }

    static getAll = async (req: Request, res: Response) => {
        const shakha = await prisma.shakha.findMany({
            where: { isActive: true }
        });

        const data = shakha.map(e => filterData(e));

        sendSuccess(res, data, "Successful");
    }

    static create = async (req: Request, res: Response) => {
        const body: CreateShakha = req.body;

        const shakha = await prisma.shakha.create({
            data: {
                name: body.name,
                location: body.location,
                establishDate: body.establishDate === undefined ? null : new Date(body.establishDate!),
                shakhaType: body.shakhaType,
                locationLat: body.locationLat,
                locationLong: body.locationLong,
                timing: body.timing
                    ? new Date(`1970-01-01T${body.timing}:00Z`)
                    : null,
            },
        });

        const data = filterData(shakha);

        sendSuccess(res, data, "Shakha registerd successfully!");
    }

    static update = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;
        const body: UpdateShakha = req.body;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: id, isActive: true }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        await prisma.shakha.update({
            where: { id: id, isActive: true },
            data: {
                name: body.name,
                location: body.location,
                establishDate: body.establishDate === undefined ? null : new Date(body.establishDate!),
                shakhaType: body.shakhaType,
                locationLat: body.locationLat,
                locationLong: body.locationLong,
                timing: body.timing
                    ? new Date(`1970-01-01T${body.timing}:00Z`)
                    : null,
            }
        });

        const data = filterData(shakha);

        sendSuccess(res, data, "Shakha updated successfully!");
    }

    static delete = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: id, isActive: true }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        const memberRoles = await prisma.memberRole.findMany({
            where: {
                shakhaMember: { shakhaId: shakha.id, isActive: true },
            },
            select: { id: true }
        });

        const ids = memberRoles.map(e => e.id);

        await prisma.$transaction([
            prisma.memberRole.updateMany({
                where: {
                    shakhaMemberId: { in: ids },
                    revokedAt: null
                },
                data: {
                    revokedAt: new Date(),
                }
            }),

            prisma.shakhaMember.updateMany({
                where: { shakhaId: shakha.id, isActive: true },
                data: { isActive: false }
            }),

            prisma.shakha.update({
                where: { id: shakha.id, isActive: true },
                data: { isActive: false }
            }),
        ]);

        sendSuccess(res, null, "Shakha deleted successfully!");
    }

    static members = async (req: Request, res: Response) => {
        const shakhaId = (req.params.id) as string;

        if (!shakhaId) {
            throw new AppError("Please enter shakha id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: shakhaId, isActive: true },
            select: {
                shakhaMember: {
                    select: {
                        member: true
                    }
                }
            }
        });

        if (!shakha) {
            throw new AppError("Shakha not exist!", 404);
        }

        const members = shakha.shakhaMember.map((e) =>
            filterData(e.member, ['systemRole'])
        );

        sendSuccess(res, members, "Members fetched successfully!");
    }

    static roles = async (req: Request, res: Response) => {
        const shakhaId = req.params.id as string;

        if (!shakhaId) {
            throw new AppError(
                "Please enter shakha id as route param!",
                400
            );
        }

        const shakha = await prisma.shakha.findFirst({
            where: {
                id: shakhaId,
                isActive: true
            },
            select: {
                id: true,
                name: true,

                shakhaMember: {
                    where: {
                        isActive: true
                    },

                    select: {
                        id: true,
                        joiningDate: true,

                        member: {
                            select: {
                                id: true,
                                name: true,
                                mobile: true,
                                email: true,
                                address: true,
                                dob: true,
                                systemRole: true
                            }
                        },

                        memberRole: {
                            where: {
                                isActive: true
                            },

                            select: {
                                id: true,

                                canAddMember: true,
                                canRemoveMember: true,
                                canEditMember: true,
                                canAssignRole: true,
                                canViewAll: true,

                                role: {
                                    select: {
                                        id: true,
                                        name: true,
                                        description: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!shakha) {
            throw new AppError("Shakha not exist!", 404);
        }

        const result = shakha.shakhaMember.map((shakhaMember) => ({
            shakhaMemberId: shakhaMember.id,

            joiningDate: shakhaMember.joiningDate,

            member: {
                id: shakhaMember.member.id,
                name: shakhaMember.member.name,
                mobile: shakhaMember.member.mobile,
                email: shakhaMember.member.email,
                address: shakhaMember.member.address,
                dob: shakhaMember.member.dob,
                systemRole: shakhaMember.member.systemRole
            },

            roles: shakhaMember.memberRole.map((memberRole) => ({
                memberRoleId: memberRole.id,

                role: {
                    id: memberRole.role.id,
                    name: memberRole.role.name,
                    description: memberRole.role.description
                },

                permissions: {
                    canAddMember: memberRole.canAddMember,
                    canRemoveMember: memberRole.canRemoveMember,
                    canEditMember: memberRole.canEditMember,
                    canAssignRole: memberRole.canAssignRole,
                    canViewAll: memberRole.canViewAll
                }
            }))
        }));

        sendSuccess(
            res,
            result,
            "Successfully fetched shakha member roles!"
        );
    };
}