import { PrismaClient } from '@prisma/client';

class Lawyers {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  getTopLawyers() {}
  getLawyersByCity() {}
  getLawyersBySpecialty() {}
  getLawyersByRating() {}
}
