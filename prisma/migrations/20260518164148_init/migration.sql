-- CreateEnum
CREATE TYPE "MemberSystemRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'OPERATOR', 'USER');

-- CreateEnum
CREATE TYPE "ShakhaType" AS ENUM ('PRABHAT', 'SAYAM');

-- CreateTable
CREATE TABLE "Shakha" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "establishDate" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "shakhaType" "ShakhaType",
    "timing" TIME,
    "location" TEXT NOT NULL,
    "locationLat" TEXT,
    "locationLong" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Shakha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mobile" TEXT,
    "email" TEXT,
    "address" TEXT,
    "dob" DATE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "systemRole" "MemberSystemRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShakhaMember" (
    "id" TEXT NOT NULL,
    "shakhaId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "joiningDate" DATE,
    "leavingDate" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ShakhaMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canAddMember" BOOLEAN NOT NULL DEFAULT false,
    "canRemoveMember" BOOLEAN NOT NULL DEFAULT false,
    "canEditMember" BOOLEAN NOT NULL DEFAULT false,
    "canAssignRole" BOOLEAN NOT NULL DEFAULT false,
    "canViewAll" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberRole" (
    "id" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "shakhaMemberId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "canAddMember" BOOLEAN NOT NULL DEFAULT false,
    "canRemoveMember" BOOLEAN NOT NULL DEFAULT false,
    "canEditMember" BOOLEAN NOT NULL DEFAULT false,
    "canAssignRole" BOOLEAN NOT NULL DEFAULT false,
    "canViewAll" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "MemberRole_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_level_key" ON "Role"("level");

-- CreateIndex
CREATE UNIQUE INDEX "MemberCredential_userName_key" ON "MemberCredential"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "MemberCredential_memberId_key" ON "MemberCredential"("memberId");

-- AddForeignKey
ALTER TABLE "ShakhaMember" ADD CONSTRAINT "ShakhaMember_shakhaId_fkey" FOREIGN KEY ("shakhaId") REFERENCES "Shakha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShakhaMember" ADD CONSTRAINT "ShakhaMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_shakhaMemberId_fkey" FOREIGN KEY ("shakhaMemberId") REFERENCES "ShakhaMember"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCredential" ADD CONSTRAINT "MemberCredential_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
