import "dotenv/config"
import express, { NextFunction, Request, Response } from 'express';
import swaggerUi from "swagger-ui-express";
import authRouter from './routes/auth/routes/auth';
import { AppError } from "./lib/errors";
import { sendError } from "./lib/response";
import morgan from "morgan";
import { validateEnv } from "./lib/validateEnv";
import shakhaRouter from './routes/shakha/routes/shakha';
import memberRouter from './routes/member/routes/member';
import shakhaMemberRouter from './routes/shakha-member/routes/shakhaMember';
import memberRoleRouter from './routes/member-role/routes/memberRole';
import roleRouter from './routes/role/routes/role';

validateEnv();

const app = express();

app.use(express.json());

// app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(morgan("dev"));

// Swagger UI
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/shakha", shakhaRouter);
app.use("/member", memberRouter);
app.use("/shakha-members", shakhaMemberRouter);
app.use("/member-roles", memberRoleRouter);
app.use("/roles", roleRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        // res.status(err.statusCode).json({ message: err.message });
        sendError(res, err.message, err.statusCode);
        return;
    }

    console.error(err.message);
    // res.status(500).json({ message: "Internal server error" });
    sendError(res, err.message, 500);
});

const PORT: number = Number(process.env.PORT) || 3000;
const HOST: string = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://10.25.11.197:${PORT}`);
});