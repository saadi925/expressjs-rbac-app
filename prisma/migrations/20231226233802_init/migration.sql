/*
  Warnings:

  - The primary key for the `Attachment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Attachment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Case` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `CaseDetail` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `CaseDetail` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `caseId` on the `Attachment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `caseId` on the `CaseDetail` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_caseId_fkey";

-- DropForeignKey
ALTER TABLE "CaseDetail" DROP CONSTRAINT "CaseDetail_caseId_fkey";

-- AlterTable
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "caseId",
ADD COLUMN     "caseId" BIGINT NOT NULL,
ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Case" DROP CONSTRAINT "Case_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ALTER COLUMN "status" DROP DEFAULT,
ADD CONSTRAINT "Case_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CaseDetail" DROP CONSTRAINT "CaseDetail_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
DROP COLUMN "caseId",
ADD COLUMN     "caseId" BIGINT NOT NULL,
ADD CONSTRAINT "CaseDetail_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "CaseDetail" ADD CONSTRAINT "CaseDetail_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
