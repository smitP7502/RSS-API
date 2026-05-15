/*
  Warnings:

  - You are about to drop the column `role` on the `Member` table. All the data in the column will be lost.
  - Made the column `isActive` on table `ShakhaMember` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "MemberSystemRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'USER');

-- CreateEnum
CREATE TYPE "ShakhaType" AS ENUM ('PRABHAT', 'SAYAM');

-- AlterTable
ALTER TABLE "Member" DROP COLUMN "role",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "systemRole" "MemberSystemRole" NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "MemberCredential" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "MemberRole" ADD COLUMN     "canAddMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canAssignRole" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canEditMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canRemoveMember" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canViewAll" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Shakha" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "locationLat" TEXT,
ADD COLUMN     "locationLong" TEXT,
ADD COLUMN     "shakhaTiming" TIMESTAMP(3),
ADD COLUMN     "shakhaType" "ShakhaType";

-- AlterTable
ALTER TABLE "ShakhaMember" ALTER COLUMN "isActive" SET NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true;
