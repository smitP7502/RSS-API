-- AlterTable
ALTER TABLE "Member" ALTER COLUMN "dob" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Shakha" ALTER COLUMN "establishDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "ShakhaMember" ALTER COLUMN "leavingDate" SET DATA TYPE DATE,
ALTER COLUMN "joiningDate" SET DATA TYPE DATE;
