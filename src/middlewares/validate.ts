import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({
                message: "Validation Error!",
                errors: error.issues.map((e) => ({
                    field: e.path.join(".").length === 0 ? "Unknow field" : e.path.join("."),
                    issue: e.message,
                }))
            });
        }
        return;
    }
}