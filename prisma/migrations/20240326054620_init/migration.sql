/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `LawyerContact` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `LawyerProfile` table. All the data in the column will be lost.
  - Made the column `email` on table `LawyerContact` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `LawyerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experience` on table `LawyerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `education` on table `LawyerProfile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `specialization` on table `LawyerProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LawyerContact" DROP COLUMN "phoneNumber",
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "LawyerProfile" DROP COLUMN "bio",
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "experience" SET NOT NULL,
ALTER COLUMN "education" SET NOT NULL,
ALTER COLUMN "specialization" SET NOT NULL;
