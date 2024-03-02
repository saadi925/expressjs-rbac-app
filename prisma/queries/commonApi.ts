import { CaseStatus, PrismaClient } from '@prisma/client';

class CommonPrismaApi {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
}
