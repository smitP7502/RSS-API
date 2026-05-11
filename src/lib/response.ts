import { Response } from "express";

export const sendSuccess = (
    res: Response,
    data: unknown,
    message: string = "Success",
    statusCode: number = 200
) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (
    res: Response,
    message: string = "Something went wrong",
    statusCode: number = 500
) => {
    res.status(statusCode).json({
        success: false,
        message,
        data: null,
    });
};