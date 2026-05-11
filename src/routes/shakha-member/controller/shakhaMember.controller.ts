import { Request, Response } from "express";
import {
    AddShakhaMember,
    UpdateShakhaMember
} from "../schema/shakhaMember.schema";

import prisma from "../../../lib/prisma";
import { AppError } from "../../../lib/errors";
import { sendSuccess } from "../../../lib/response";

export class ShakhaMemberController {

    static add = async (req: Request, res: Response) => {
        const {
            memberId,
            shakhaId,
            joiningDate,
            leavingDate
        } = req.body as AddShakhaMember;

        // Check member exists
        const member = await prisma.member.findUnique({
            where: { id: memberId }
        });

        if (!member) {
            throw new AppError(
                "Member does not exist with given id!",
                404
            );
        }

        // Check shakha exists
        const shakha = await prisma.shakha.findUnique({
            where: { id: shakhaId }
        });

        if (!shakha) {
            throw new AppError(
                "Shakha does not exist with given id!",
                404
            );
        }

        // Check active membership
        const activeShakhaMember =
            await prisma.shakhaMember.findFirst({
                where: {
                    memberId,
                    leavingDate: null
                }
            });

        if (activeShakhaMember) {
            throw new AppError(
                "Member already belongs to another shakha!",
                409
            );
        }

        // Create membership
        const shakhaMember =
            await prisma.shakhaMember.create({
                data: {
                    memberId,
                    shakhaId,
                    joiningDate,
                    leavingDate,
                }
            });

        sendSuccess(
            res,
            shakhaMember,
            "Shakha member added successfully!"
        );
    };

    static update = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        const {
            memberId,
            shakhaId,
            joiningDate,
            leavingDate
        } = req.body as UpdateShakhaMember;

        if (!id) {
            throw new AppError(
                "You must pass id in params",
                400
            );
        }

        // Check membership exists
        const existingMembership =
            await prisma.shakhaMember.findUnique({
                where: { id }
            });

        if (!existingMembership) {
            throw new AppError(
                "Shakha member does not exist!",
                404
            );
        }

        // Check member exists
        const member = await prisma.member.findUnique({
            where: { id: memberId }
        });

        if (!member) {
            throw new AppError(
                "Member does not exist with given id!",
                404
            );
        }

        // Check shakha exists
        const shakha = await prisma.shakha.findUnique({
            where: { id: shakhaId }
        });

        if (!shakha) {
            throw new AppError(
                "Shakha does not exist with given id!",
                404
            );
        }

        // Prevent multiple active memberships
        const activeMembership =
            await prisma.shakhaMember.findFirst({
                where: {
                    memberId,
                    leavingDate: null,
                    NOT: {
                        id
                    }
                }
            });

        if (activeMembership) {
            throw new AppError(
                "Member already belongs to another shakha!",
                409
            );
        }

        // Update membership
        const updatedShakhaMember =
            await prisma.shakhaMember.update({
                where: { id },
                data: {
                    memberId,
                    shakhaId,
                    joiningDate,
                    leavingDate
                }
            });

        sendSuccess(
            res,
            updatedShakhaMember,
            "Shakha member updated successfully!"
        );
    };

    static getAll = async (_req: Request, res: Response) => {
        const shakhaMembers =
            await prisma.shakhaMember.findMany({
                include: {
                    member: true,
                    shakha: true,
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });

        sendSuccess(
            res,
            shakhaMembers,
            "Fetched successfully!"
        );
    };

    static getByID = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError(
                "You must pass id in params",
                400
            );
        }

        const shakhaMember =
            await prisma.shakhaMember.findUnique({
                where: { id },
                include: {
                    member: true,
                    shakha: true,
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });

        if (!shakhaMember) {
            throw new AppError(
                "Shakha member does not exist!",
                404
            );
        }

        sendSuccess(
            res,
            shakhaMember,
            "Fetched successfully!"
        );
    };

    static delete = async (req: Request, res: Response) => {
        const id = req.params.id as string;

        if (!id) {
            throw new AppError(
                "You must pass id in params",
                400
            );
        }

        const shakhaMember =
            await prisma.shakhaMember.findUnique({
                where: { id }
            });

        if (!shakhaMember) {
            throw new AppError(
                "Shakha member does not exist!",
                404
            );
        }

        await prisma.shakhaMember.delete({
            where: { id }
        });

        sendSuccess(
            res,
            null,
            "Shakha member deleted successfully!"
        );
    };
}