-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "lawyerId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
