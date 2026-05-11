/*
  Warnings:

  - You are about to drop the column `memeberId` on the `MemberRole` table. All the data in the column will be lost.
  - You are about to drop the column `joinningDate` on the `ShakhaMember` table. All the data in the column will be lost.
  - You are about to drop the column `dbo` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId,memberId]` on the table `MemberRole` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `MemberRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MemberRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MemberRole" DROP CONSTRAINT "MemberRole_memeberId_fkey";

-- AlterTable
ALTER TABLE "MemberRole" DROP COLUMN "memeberId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "memberId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ShakhaMember" DROP COLUMN "joinningDate",
ADD COLUMN     "joiningDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "dbo",
ADD COLUMN     "dob" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserCredential" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userId_key" ON "UserCredential"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberRole_roleId_memberId_key" ON "MemberRole"("roleId", "memberId");

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "ShakhaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCredential" ADD CONSTRAINT "UserCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
