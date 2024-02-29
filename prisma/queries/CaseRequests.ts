import {
  PrismaClient,
  CaseRequest as PrismaCaseRequestModel,
} from '@prisma/client';

interface CaseRequestData {
  clientId: string;
  lawyerId: string;
  caseId: bigint;
}

export class PrismaCaseRequest {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async createCaseRequest(
    data: CaseRequestData,
  ): Promise<PrismaCaseRequestModel> {
    const createdCaseRequest = await this.#prisma.caseRequest.create({ data });
    return createdCaseRequest;
  }

  async getCaseRequestById(
    requestId: bigint,
  ): Promise<PrismaCaseRequestModel | null> {
    const caseRequest = await this.#prisma.caseRequest.findUnique({
      where: { id: requestId },
    });
    return caseRequest;
  }

  async acceptCaseRequest(requestId: bigint): Promise<void> {
    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }

  async rejectCaseRequest(requestId: bigint): Promise<void> {
    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async getPendingCaseRequests(
    lawyerId: string,
  ): Promise<PrismaCaseRequestModel[]> {
    const pendingRequests = await this.#prisma.caseRequest.findMany({
      where: {
        lawyerId,
        status: 'PENDING',
      },
    });
    return pendingRequests;
  }
}
