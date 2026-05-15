import { Request, Response } from "express";
import { AddRole } from "../schema/role.schema";
import prisma from "../../../lib/prisma";
import { AppError } from "../../../lib/errors";
import { sendSuccess } from "../../../lib/response";
import filterData from "../../../utils/filter_data";

export class RoleController {
    static add = async (req: Request, res: Response) => {
        const { name } = req.body as AddRole;

        const roleExist = await prisma.role.findFirst({
            where: { name, isActive: true }
        });

        if (roleExist) {
            throw new AppError("Role already exists!", 409);
        }

        const newRole = await prisma.role.create({
            data: { name }
        });

        sendSuccess(res, newRole, "Role added successfully!");
    }

    static getAll = async (_req: Request, res: Response) => {
        const roles = await prisma.role.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const updatedRoles = roles.map(
            ({ createdAt, updatedAt, ...rest }) => rest
        );

        sendSuccess(res, updatedRoles, "Roles fetched successfully!");
    }

    // static getById = async (req: Request, res: Response) => {
    //     const id = Number(req.params.id);

    //     if (isNaN(id)) {
    //         throw new AppError("Invalid role id!", 400);
    //     }

    //     const role = await prisma.role.findUnique({
    //         where: { id }
    //     });

    //     if (!role) {
    //         throw new AppError("Role not found!", 404);
    //     }

    //     sendSuccess(res, role, "Role fetched successfully!");
    // }

    static update = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { name } = req.body as AddRole;

        if (isNaN(id)) {
            throw new AppError("Invalid role id!", 400);
        }

        const role = await prisma.role.findFirst({
            where: { id, isActive: true }
        });

        if (!role) {
            throw new AppError("Role not found!", 404);
        }

        const roleExist = await prisma.role.findFirst({
            where: {
                name,
                NOT: {
                    id
                },
                isActive: true
            }
        });

        if (roleExist) {
            throw new AppError("Role already exists!", 409);
        }

        const updatedRole = await prisma.role.update({
            where: { id, isActive: true },
            data: {
                name
            }
        });

        sendSuccess(res, updatedRole, "Role updated successfully!");
    }

    static delete = async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new AppError("Invalid role id!", 400);
        }

        const role = await prisma.role.findUnique({
            where: { id, isActive: true }
        });

        if (!role) {
            throw new AppError("Role not found!", 404);
        }

        const memberRoles = await prisma.memberRole.findMany();

        const ids = memberRoles
            .filter(e => e.roleId === role.id)
            .map(e => e.id);

        await prisma.$transaction([
            prisma.memberRole.updateMany({
                where: {
                    revokedAt: null,
                    id: { in: ids }
                },
                data: {
                    revokedAt: new Date()
                }
            }),
            prisma.role.update({
                where: { id, isActive: true },
                data: {
                    isActive: false
                }
            }),
        ]);

        sendSuccess(res, null, "Role deleted successfully!");
    }
}