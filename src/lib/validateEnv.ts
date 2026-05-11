const requiredEnvVars = [
    "DATABASE_URL",
    "JWT_SECRET",
    "PORT"
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error("Missing required environment variables:");
        missing.forEach(key => console.error(`  - ${key}`));
        process.exit(1); // stop the server immediately
    }
};