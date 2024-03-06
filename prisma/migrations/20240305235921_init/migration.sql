-- CreateTable
CREATE TABLE "LawyerVerification" (
    "id" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "barCouncilRegistrationNumber" TEXT NOT NULL,
    "certificateVerificationId" TEXT NOT NULL,
    "lawGatPass" BOOLEAN NOT NULL,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "licenseNumber" TEXT,
    "licenseExpiryDate" TIMESTAMP(3),
    "practiceArea" TEXT,

    CONSTRAINT "LawyerVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LawyerVerification_lawyerId_key" ON "LawyerVerification"("lawyerId");

-- AddForeignKey
ALTER TABLE "LawyerVerification" ADD CONSTRAINT "LawyerVerification_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "LawyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
