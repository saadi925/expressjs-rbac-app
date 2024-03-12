/*
  Warnings:

  - You are about to drop the column `email` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `facebook` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `instagram` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `LawyerProfile` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `LawyerProfile` table. All the data in the column will be lost.
  - Added the required column `category` to the `Case` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `LawyerReview` table without a default value. This is not possible if the table is not empty.
  - Added the required column `score` to the `LawyerReview` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CaseCategory" AS ENUM ('FAMILY', 'CRIMINAL', 'CIVIL', 'LABOUR', 'PROPERTY', 'BUSINESS', 'OTHER');

-- AlterTable
ALTER TABLE "Case" ADD COLUMN     "category" "CaseCategory" NOT NULL;

-- AlterTable
ALTER TABLE "LawyerProfile" DROP COLUMN "email",
DROP COLUMN "facebook",
DROP COLUMN "instagram",
DROP COLUMN "linkedin",
DROP COLUMN "phone",
DROP COLUMN "phoneNumber",
ADD COLUMN     "rating" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "LawyerReview" ADD COLUMN     "comment" TEXT NOT NULL,
ADD COLUMN     "score" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ALTER COLUMN "name" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LawyerContact" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "phone" TEXT,
    "officeAddress" TEXT,

    CONSTRAINT "LawyerContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LawyerContact_lawyerId_key" ON "LawyerContact"("lawyerId");

-- AddForeignKey
ALTER TABLE "LawyerContact" ADD CONSTRAINT "LawyerContact_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
