/*
  Warnings:

  - You are about to drop the column `userName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `UserCredential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userName` to the `UserCredential` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userName";

-- AlterTable
ALTER TABLE "UserCredential" ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserCredential_userName_key" ON "UserCredential"("userName");
