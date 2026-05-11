-- DropIndex
DROP INDEX "ShakhaMember_memberId_key";

-- AlterTable
ALTER TABLE "ShakhaMember" ADD COLUMN     "isActive" BOOLEAN;
