/*
  Warnings:

  - The `status` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'DISMISSED', 'CLOSED', 'PENDING');

-- AlterTable
ALTER TABLE "Case" DROP COLUMN "status",
ADD COLUMN     "status" "CaseStatus" NOT NULL DEFAULT 'OPEN';
