/*
  Warnings:

  - The primary key for the `Profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `displayname` on the `Profile` table. All the data in the column will be lost.
  - The `id` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_id_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_pkey",
DROP COLUMN "displayname",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
