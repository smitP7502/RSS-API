import "dotenv/config"
import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken';
import { AuthUser } from "../types/express";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const bererToken = req.headers.authorization;

    if (!bererToken) {
        res.status(401).json({ message: "Invalid or Expired token!" });
        return;
    }

    const token = bererToken.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Invalid or Expired token!" });
        return;
    }

    try {
        const user: AuthUser = jwt.verify(token, process.env.JWT_SECRET as string) as AuthUser;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or Expired token!" });
        return;
    }
}