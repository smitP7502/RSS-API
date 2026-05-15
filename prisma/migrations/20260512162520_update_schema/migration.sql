/*
  Warnings:

  - You are about to drop the column `isActive` on the `MemberCredential` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `MemberRole` table. All the data in the column will be lost.
  - You are about to drop the column `shakhaTiming` on the `Shakha` table. All the data in the column will be lost.
  - Added the required column `shakhaMemberId` to the `MemberRole` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MemberRole" DROP CONSTRAINT "MemberRole_memberId_fkey";

-- DropIndex
DROP INDEX "MemberRole_roleId_memberId_key";

-- AlterTable
ALTER TABLE "MemberCredential" DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "MemberRole" DROP COLUMN "memberId",
ADD COLUMN     "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "shakhaMemberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Shakha" DROP COLUMN "shakhaTiming",
ADD COLUMN     "timing" TIME;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_shakhaMemberId_fkey" FOREIGN KEY ("shakhaMemberId") REFERENCES "ShakhaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
