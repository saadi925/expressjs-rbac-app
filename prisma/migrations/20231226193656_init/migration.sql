-- DropIndex
DROP INDEX "Profile_id_key";

-- AlterTable
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
