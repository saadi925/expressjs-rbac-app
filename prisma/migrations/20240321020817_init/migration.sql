/*
  Warnings:

  - You are about to drop the column `contact` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "contact",
ADD COLUMN     "phone" TEXT;
