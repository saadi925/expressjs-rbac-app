import { Case, CaseStatus, PrismaClient } from '@prisma/client';
export type CaseData = Omit<Case, 'id'>;
export class PrismaCase {
  #prisma;
  constructor() {
    this.#prisma = new PrismaClient();
  }
  async caseExists(caseId: bigint): Promise<boolean> {
    const found = await this.#prisma.case.findUnique({
      where: { id: caseId },
    });
    return !!found;
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
  async getCases(clientId: string) {
    return await this.#prisma.case.findMany({
      where: {
        clientId,
      },
    });
  }
  async getCaseByID(id: bigint) {
    return await this.#prisma.case.findUnique({
      where: { id },
    });
  }
  async addLawyerToCase(
    lawyerId: string,
    clientId: string,
    caseId: bigint,
    status: CaseStatus,
  ) {
    const updatedCase = await this.#prisma.case.update({
      data: {
        lawyerId,
        status,
      },
      where: { id: caseId, clientId },
      include: {
        lawyer: { select: { name: true } },
        client: {
          select: { name: true },
        },
      },
    });

    return updatedCase;
  }
  updateCaseStatus(status: CaseStatus, caseId: bigint, clientId: string) {
    return this.#prisma.case.update({
      data: { status },
      where: { id: caseId, clientId },
    });
  }
}
