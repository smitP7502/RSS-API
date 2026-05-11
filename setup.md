# Backend Project Setup — Commands Reference

> Every command you need from scratch to a running backend with auth and database.
> Copy these in order for every new project.

---

## Step 1 — Create project folder

```bash
mkdir project-name
cd project-name
```

---

## Step 2 — Initialize Node.js project

```bash
npm init -y
```

Creates `package.json` — the project's identity card.
`-y` means yes to all default questions, skips the interactive setup.

---

## Step 3 — Install TypeScript and Node.js types

```bash
npm install typescript ts-node @types/node --save-dev
```

| Package | What it does |
|---|---|
| `typescript` | The TypeScript compiler |
| `ts-node` | Runs `.ts` files directly without compiling first |
| `@types/node` | Type definitions for Node.js built-ins (fs, path, process etc) |

`--save-dev` means these are development-only tools — not needed in production.

---

## Step 4 — Create TypeScript config

```bash
npx tsc --init
```

Creates `tsconfig.json`. Then replace its contents with:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true
  }
}
```

| Option | What it does |
|---|---|
| `target: ES2020` | Which JavaScript version to compile to |
| `rootDir: ./src` | All your TypeScript files live here |
| `outDir: ./dist` | Compiled JavaScript goes here |
| `strict: true` | Enables all strict type checks |
| `noImplicitAny` | Every variable must have a type |
| `strictNullChecks` | null and undefined must be handled explicitly |
| `esModuleInterop` | Allows `import x from "y"` syntax |

---

## Step 5 — Install nodemon for auto-restart

```bash
npm install nodemon --save-dev
```

Add this to `package.json` inside `"scripts"`:

```json
"scripts": {
  "dev": "nodemon --watch src --ext ts --exec ts-node src/server.ts"
}
```

| Part | What it does |
|---|---|
| `--watch src` | Watch the src folder for changes |
| `--ext ts` | Only trigger on .ts file saves |
| `--exec ts-node src/server.ts` | Run this command on every restart |

Run your server with:
```bash
npm run dev
```

---

## Step 6 — Install Express

```bash
npm install express
npm install @types/express --save-dev
```

`express` → the actual library that runs at runtime
`@types/express` → type definitions so TypeScript knows what Request, Response, Router look like

---

## Step 7 — Install Zod for validation

```bash
npm install zod
```

No `@types` needed — Zod is written in TypeScript so types are built in.

---

## Step 8 — Install dotenv for environment variables

```bash
npm install dotenv
```

Create `.env` file in project root:
```env
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/your_db_name?schema=public"
JWT_SECRET="your-super-secret-key-make-this-long-and-random"
PORT=3000
```

Add `.env` to `.gitignore` immediately — never commit secrets:
```
node_modules
dist
.env
```

Always import dotenv as the very first line in `server.ts`:
```ts
import "dotenv/config"; // must be first — loads .env before anything else
```

---

## Step 9 — Install Prisma (database ORM)

```bash
npm install prisma --save-dev
npm install @prisma/client
npm install @prisma/adapter-pg pg
npm install @types/pg --save-dev
```

| Package | What it does |
|---|---|
| `prisma` | CLI tool for migrations and schema management |
| `@prisma/client` | The client you use in code to query the database |
| `@prisma/adapter-pg` | Connects Prisma to PostgreSQL (required in Prisma 7+) |
| `pg` | PostgreSQL driver — actual connection to the database |
| `@types/pg` | Type definitions for pg |

Initialize Prisma:
```bash
npx prisma init
```

Creates:
- `prisma/schema.prisma` → define your tables here
- `prisma.config.ts` → database connection config
- `.env` → connection string (if not already created)

---

## Step 10 — Configure Prisma

`prisma.config.ts` should look like this:
```ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

`prisma/schema.prisma` base setup:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

// add your models below
```

---

## Step 11 — Install Auth packages

```bash
npm install bcrypt jsonwebtoken
npm install @types/bcrypt @types/jsonwebtoken --save-dev
```

| Package | What it does |
|---|---|
| `bcrypt` | Hashes passwords so plain text is never stored |
| `jsonwebtoken` | Creates and verifies JWT tokens |
| `@types/bcrypt` | TypeScript types for bcrypt |
| `@types/jsonwebtoken` | TypeScript types for jsonwebtoken |

---

## Prisma commands — use these when working with database

```bash
# First time — create tables from your schema
npx prisma migrate dev --name init

# After changing schema — create new migration
npx prisma migrate dev --name describe_what_changed
# example: npx prisma migrate dev --name add_user_model
# example: npx prisma migrate dev --name add_price_to_books

# After changing schema without migration (regenerate client only)
npx prisma generate

# Open visual database browser in browser
npx prisma studio
```

**Rule:** every time you change `schema.prisma`, run `migrate dev` to apply changes to your database.

---

## Folder structure — use this for every project

```
project-name/
  prisma/
    schema.prisma       ← table definitions
    migrations/         ← auto-generated, don't edit
  src/
    lib/
      prisma.ts         ← prisma singleton client
    types/
      express.d.ts      ← extend Express Request type (for req.user)
    middleware/
      validate.ts       ← Zod validation middleware
    auth/
      routes/
        auth.ts         ← register, login, me routes
      schema/
        auth.schema.ts  ← register and login Zod schemas
      middleware/
        authenticate.ts ← JWT verification middleware
        authorize.ts    ← role checking middleware factory
    books/              ← example feature folder
      routes/
        books.ts
      schema/
        book.schema.ts
  .env                  ← secrets — never commit
  .gitignore
  package.json
  tsconfig.json
  prisma.config.ts
```

---

## `src/lib/prisma.ts` — copy this every project

```ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
```

---

## `src/types/express.d.ts` — copy this every project

```ts
export interface AuthUser {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
```

---

## `src/server.ts` base — copy this every project

```ts
import "dotenv/config"; // always first
import express, { Application, Request, Response } from "express";

const app: Application = express();

app.use(express.json()); // parse JSON bodies — before all routes

app.get("/health", (req: Request, res: Response): void => {
  res.json({ status: "ok" });
});

// mount routers here
// app.use("/auth", authRouter);
// app.use("/books", booksRouter);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Full install — one block to copy for new projects

```bash
npm init -y
npm install express zod dotenv bcrypt jsonwebtoken @prisma/client @prisma/adapter-pg pg
npm install typescript ts-node nodemon @types/node @types/express @types/bcrypt @types/jsonwebtoken @types/pg prisma --save-dev
npx tsc --init
npx prisma init
```

Then:
1. Replace `tsconfig.json` with the strict config above
2. Add script to `package.json`
3. Set up `.env` with your database URL and JWT secret
4. Configure `prisma.config.ts`
5. Define models in `schema.prisma`
6. Run `npx prisma migrate dev --name init`
7. Create your folder structure
8. Start coding

---

## npm install flags — quick reference

```
npm install package           → production dependency (needed at runtime)
npm install package --save-dev → dev only dependency (not needed in production)

Short versions:
npm install = npm i
--save-dev  = -D

Examples:
npm i express                 → runtime — needed when server runs
npm i typescript -D           → dev only — just for compiling during development
npm i @types/express -D       → dev only — just for TypeScript to understand express
```
