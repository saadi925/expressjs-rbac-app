import { Case, CaseStatus, PrismaClient } from '@prisma/client';
import { prisma } from '.';
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
  async getAllOpenCases(userId: string) {
    const cases = await this.#prisma.case.findMany({
      where: {
        lawyerId: null,
        clientId: userId,
        status: 'OPEN',
      },
      orderBy: { createdAt: 'desc' },
    });
    return cases;
  }
  async createCase(data: CaseData): Promise<Case> {
    const createdCase = await this.#prisma.case.create({
      data,
    });
    return createdCase;
  }
  async updateCase(data: Omit<Case, 'status'>, caseID: bigint) {
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
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        client: {
          select: {
            name: true,
            profile: { select: { avatar: true } },
          },
        },
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
        lawyer: {
          select: { name: true, profile: { select: { avatar: true } } },
        },
        client: {
          select: { name: true, profile: { select: { avatar: true } } },
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
export async function getLawyerIdFromCase(
  caseId: bigint,
  clientId: string,
): Promise<string | null> {
  try {
    // Query the database to find the case with the specified ID
    const caseData = await prisma.case.findUnique({
      where: { id: caseId, clientId },
      select: { clientId: true, lawyerId: true },
    });

    if (!caseData) {
      return null; // Case not found
    }
    // Return the lawyer ID from the case
    return caseData.lawyerId;
  } catch (error) {
    console.error('Error fetching lawyer ID from case:', error);
    throw error;
  }
}
