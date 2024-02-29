import { Case, PrismaClient } from '@prisma/client';
export type CaseData = Omit<Case, 'id'>;
export class PrismaCase {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async createCase(data: CaseData): Promise<Case> {
    const createdCase = await this.#prisma.case.create({
      data,
    });
    return createdCase;
  }
  async updateCase(data: Case, caseID: bigint) {
    return await this.#prisma.case.update({
      where: { id: caseID, clientId: data.clientId },
      data,
    });
  }
  async deleteCase(id: bigint, clientId: string) {
    return await this.#prisma.case.delete({
      where: { id, clientId },
    });
  }
  async getCases() {
    return await this.#prisma.case.findMany();
  }
  async getCaseByID(id: bigint) {
    return await this.#prisma.case.findUnique({
      where: { id },
    });
  }
  async addLawyerToCase(lawyerId: string, clientId: string, caseId: bigint) {
    return await this.#prisma.case.update({
      data: {
        lawyerId,
      },
      where: { id: caseId, clientId },
    });
  }
}
