/*
  Warnings:

  - You are about to drop the column `userId` on the `ShakhaMember` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserCredential` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[memberId]` on the table `ShakhaMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memberId` to the `ShakhaMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShakhaMember" DROP CONSTRAINT "ShakhaMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCredential" DROP CONSTRAINT "UserCredential_userId_fkey";

-- DropIndex
DROP INDEX "ShakhaMember_userId_key";

-- AlterTable
ALTER TABLE "ShakhaMember" DROP COLUMN "userId",
ADD COLUMN     "memberId" TEXT NOT NULL;

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserCredential";

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "address" TEXT,
    "dob" TIMESTAMP(3),
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberCredential" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MemberCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MemberCredential_userName_key" ON "MemberCredential"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "MemberCredential_memberId_key" ON "MemberCredential"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "ShakhaMember_memberId_key" ON "ShakhaMember"("memberId");

-- AddForeignKey
ALTER TABLE "ShakhaMember" ADD CONSTRAINT "ShakhaMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCredential" ADD CONSTRAINT "MemberCredential_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
