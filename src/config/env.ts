import 'dotenv/config';

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    IS_PRODUCTION: process.env.NODE_ENV === "production"
};