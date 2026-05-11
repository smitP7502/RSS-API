import { Request, Response } from "express";
import { CreateShakha, UpdateShakha, UpdateShakhaSchema } from "../shcema/shakha.schema";
import { AppError } from "../../../lib/errors";
import prisma from "../../../lib/prisma";
import { sendSuccess } from "../../../lib/response";

export class ShakhaController {
    static get = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: id }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        sendSuccess(res, shakha, "Successful");
    }

    static getAll = async (req: Request, res: Response) => {
        const shakha = await prisma.shakha.findMany();

        sendSuccess(res, shakha, "Successful");

        sendSuccess(res, shakha, "Successful");
    }

    static create = async (req: Request, res: Response) => {
        const body: CreateShakha = req.body;

        const shakha = await prisma.shakha.create({
            data: {
                name: body.name,
                location: body.location,
                establishDate: body.establishDate === undefined ? null : new Date(body.establishDate!),
            },
            select: {
                id: true,
                name: true,
                location: true,
                establishDate: true,
            }
        });

        sendSuccess(res, shakha, "Shakha registerd successfully!");
    }

    static update = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;
        const body: UpdateShakha = req.body;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findUnique({
            where: { id: id }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        const updatedShakha = await prisma.shakha.update({
            where: { id: id },
            data: {
                name: body.name,
                location: body.location,
                establishDate: body.establishDate === undefined ? null : new Date(body.establishDate!),
            }
        });

        sendSuccess(res, updatedShakha, "Shakha updated successfully!");
    }

    static delete = async (req: Request, res: Response) => {
        const id = (req.params.id) as string;

        if (!id) {
            throw new AppError("Please enter id as route param!", 400);
        }

        const shakha = await prisma.shakha.findFirst({
            where: { id: id }
        });

        if (!shakha) {
            throw new AppError("Shakha not found!", 404);
        }

        await prisma.shakha.delete({
            where: { id: id }
        });

        sendSuccess(res, null, "Shakha deleted successfully!");
    }
}