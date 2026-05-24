import { Request, Response } from "express";
// import {
//     AddShakhaMember,
//     UpdateShakhaMember
// } from "../schema/shakhaMember.schema";

import prisma from "../../../lib/prisma";
import { AppError } from "../../../lib/errors";
import { sendSuccess } from "../../../lib/response";
import filterData from "../../../utils/filter_data";
import { AssignMemberRole } from "../schema/shakhaMember.schema";

export class ShakhaMemberController {

    // static add = async (req: Request, res: Response) => {
    //     const {
    //         memberId,
    //         shakhaId,
    //         joiningDate,
    //         leavingDate
    //     } = req.body as AddShakhaMember;

    //     // Check member exists
    //     const member = await prisma.member.findUnique({
    //         where: { id: memberId }
    //     });

    //     if (!member) {
    //         throw new AppError(
    //             "Member does not exist with given id!",
    //             404
    //         );
    //     }

    //     // Check shakha exists
    //     const shakha = await prisma.shakha.findUnique({
    //         where: { id: shakhaId }
    //     });

    //     if (!shakha) {
    //         throw new AppError(
    //             "Shakha does not exist with given id!",
    //             404
    //         );
    //     }

    //     // Check active membership
    //     const activeShakhaMember =
    //         await prisma.shakhaMember.findFirst({
    //             where: {
    //                 memberId,
    //                 leavingDate: null
    //             }
    //         });

    //     if (activeShakhaMember) {
    //         throw new AppError(
    //             "Member already belongs to another shakha!",
    //             409
    //         );
    //     }

    //     // Create membership
    //     const shakhaMember =
    //         await prisma.shakhaMember.create({
    //             data: {
    //                 memberId,
    //                 shakhaId,
    //                 joiningDate,
    //                 leavingDate,
    //             }
    //         });

    //     sendSuccess(
    //         res,
    //         shakhaMember,
    //         "Shakha member added successfully!"
    //     );
    // };

    // static update = async (req: Request, res: Response) => {
    //     const id = req.params.id as string;

    //     const {
    //         memberId,
    //         shakhaId,
    //         joiningDate,
    //         leavingDate
    //     } = req.body as UpdateShakhaMember;

    //     if (!id) {
    //         throw new AppError(
    //             "You must pass id in params",
    //             400
    //         );
    //     }

    //     // Check membership exists
    //     const existingMembership =
    //         await prisma.shakhaMember.findUnique({
    //             where: { id }
    //         });

    //     if (!existingMembership) {
    //         throw new AppError(
    //             "Shakha member does not exist!",
    //             404
    //         );
    //     }

    //     // Check member exists
    //     const member = await prisma.member.findUnique({
    //         where: { id: memberId }
    //     });

    //     if (!member) {
    //         throw new AppError(
    //             "Member does not exist with given id!",
    //             404
    //         );
    //     }

    //     // Check shakha exists
    //     const shakha = await prisma.shakha.findUnique({
    //         where: { id: shakhaId }
    //     });

    //     if (!shakha) {
    //         throw new AppError(
    //             "Shakha does not exist with given id!",
    //             404
    //         );
    //     }

    //     // Prevent multiple active memberships
    //     const activeMembership =
    //         await prisma.shakhaMember.findFirst({
    //             where: {
    //                 memberId,
    //                 leavingDate: null,
    //                 NOT: {
    //                     id
    //                 }
    //             }
    //         });

    //     if (activeMembership) {
    //         throw new AppError(
    //             "Member already belongs to another shakha!",
    //             409
    //         );
    //     }

    //     // Update membership
    //     const updatedShakhaMember =
    //         await prisma.shakhaMember.update({
    //             where: { id },
    //             data: {
    //                 memberId,
    //                 shakhaId,
    //                 joiningDate,
    //                 leavingDate
    //             }
    //         });

    //     sendSuccess(
    //         res,
    //         updatedShakhaMember,
    //         "Shakha member updated successfully!"
    //     );
    // };

    // static getAll = async (_req: Request, res: Response) => {
    //     const shakhaMembers =
    //         await prisma.shakhaMember.findMany({
    //             include: {
    //                 member: true,
    //                 shakha: true,
    //                 roles: {
    //                     include: {
    //                         role: true
    //                     }
    //                 }
    //             }
    //         });

    //     sendSuccess(
    //         res,
    //         shakhaMembers,
    //         "Fetched successfully!"
    //     );
    // };

    // static getByID = async (req: Request, res: Response) => {
    //     const id = req.params.id as string;

    //     if (!id) {
    //         throw new AppError(
    //             "You must pass id in params",
    //             400
    //         );
    //     }

    //     const shakhaMember =
    //         await prisma.shakhaMember.findUnique({
    //             where: { id },
    //             include: {
    //                 member: true,
    //                 shakha: true,
    //                 roles: {
    //                     include: {
    //                         role: true
    //                     }
    //                 }
    //             }
    //         });

    //     if (!shakhaMember) {
    //         throw new AppError(
    //             "Shakha member does not exist!",
    //             404
    //         );
    //     }

    //     sendSuccess(
    //         res,
    //         shakhaMember,
    //         "Fetched successfully!"
    //     );
    // };

    // static delete = async (req: Request, res: Response) => {
    //     const id = req.params.id as string;

    //     if (!id) {
    //         throw new AppError(
    //             "You must pass id in params",
    //             400
    //         );
    //     }

    //     const shakhaMember =
    //         await prisma.shakhaMember.findUnique({
    //             where: { id }
    //         });

    //     if (!shakhaMember) {
    //         throw new AppError(
    //             "Shakha member does not exist!",
    //             404
    //         );
    //     }

    //     await prisma.shakhaMember.delete({
    //         where: { id }
    //     });

    //     sendSuccess(
    //         res,
    //         null,
    //         "Shakha member deleted successfully!"
    //     );
    // };
    static getShakhaMembers = async (req: Request, res: Response) => {
        const memberId = req.user?.id;

        if (!memberId) {
            throw new AppError("User not found!", 401);
        }

        const shakhaMember = await prisma.shakhaMember.findFirst({
            where: {
                memberId: memberId,
                isActive: true,
            },
        });

        if (!shakhaMember) {
            throw new AppError("Your are not member of any shakha!", 404);
        }

        const shakhaId = shakhaMember.shakhaId;

        const members = await prisma.shakhaMember.findMany({
            where: {
                isActive: true,
                shakhaId: shakhaId
            },
            select: {
                memberRole: {
                    where: {
                        revokedAt: null,
                    },
                    select: {
                        role: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                member: {
                    select: {
                        id: true,
                        name: true,
                        mobile: true,
                        address: true,
                        email: true,
                        dob: true,
                    }
                }
            }
        });

        const data = members.map(e => {
            var memberData = {
                id: e.member.id,
                name: e.member.name,
                address: e.member.address,
                email: e.member.email,
                mobile: e.member.mobile,
                role: e.memberRole.length === 0 ? null : e.memberRole[0].role.name,
                dob: e.member.dob,
            };

            return memberData;
        });

        sendSuccess(res, data, "Data fetched sucessesfully!");
    }

    static assingRole = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const data: AssignMemberRole = req.body;

        if (isNaN(id)) {
            throw new AppError("Invalid role id!", 400);
        }

        const role = await prisma.role.findFirst({
            where: { id, isActive: true }
        });

        if (!role) {
            throw new AppError("Role not found!", 404);
        }

        const memberRole = await prisma.memberRole.findFirst({
            where: { shakhaMemberId: data.shakhaMemberId, roleId: id, revokedAt: { not: null } }
        });

        if (memberRole) {
            throw new AppError("This role is already assigned", 409);
        }

        // const memberRole1 = await prisma.memberRole.findFirst({
        //     where: { memberId: data.memberId, revokedAt: { not: null } },
        //     select: {
        //         role: {
        //             select: {
        //                 name: true
        //             }
        //         }
        //     }
        // });

        // if (memberRole1) {
        //     throw new AppError(`Already assigned to ${memberRole1.role.name}`, 409);
        // }

        const newMemberRole = await prisma.memberRole.create({
            data: {
                roleId: id,
                shakhaMemberId: data.shakhaMemberId,
                assignedAt: new Date(),
            }
        });

        sendSuccess(res, filterData(newMemberRole,), "Role assigned successfully!");
    }

    static revokeRole = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const shakahMemberId = req.params.shakahMemberId as string;

        if (isNaN(id)) {
            throw new AppError("Invalid role id!", 400);
        }

        const role = await prisma.role.findFirst({
            where: { id, isActive: true }
        });

        if (!role) {
            throw new AppError("Role not found!", 404);
        }

        if (!shakahMemberId) {
            throw new AppError("Invalid member id!", 400);
        }

        const shakahMember = await prisma.shakhaMember.findFirst({
            where: { id: shakahMemberId, isActive: true }
        });

        if (!shakahMember) {
            throw new AppError("Member not found!", 404);
        }

        const memberRole = await prisma.memberRole.findFirst({
            where: {
                roleId: id,
                shakhaMemberId: shakahMemberId,
                revokedAt: null
            }
        });

        if (!memberRole) {
            throw new AppError("Member role not found!", 404);
        }

        await prisma.memberRole.updateMany({
            where: {
                roleId: id,
                shakhaMemberId: shakahMemberId,
                revokedAt: null
            },
            data: {
                revokedAt: new Date(),
            }
        });



        sendSuccess(res, null, "Successfully revoked role!");
    }
}