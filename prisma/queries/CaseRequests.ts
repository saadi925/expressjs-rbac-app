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

  async createCaseRequest(data: CaseRequestData) {
    const createdCaseRequest = await this.#prisma.caseRequest.create({
      data,
    });
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
    const caseRequest = await this.getCaseRequestById(requestId);
    if (!caseRequest || caseRequest.status !== 'PENDING') {
      throw new Error('Invalid request');
    }

    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
  }
  async updateLawyerCases(lawyerId: string, caseId: bigint) {
    // Update lawyer's cases
    await this.#prisma.user.update({
      where: { id: lawyerId },
      data: {
        lawyerCases: {
          // Use the correct relation field name
          connect: { id: caseId },
        },
      },
    });
  }
  async updateClientCases(clientId: string, caseId: bigint) {
    // Update client's cases
    await this.#prisma.user.update({
      where: { id: clientId },
      data: {
        clientCases: {
          // Use the correct relation field name
          connect: { id: caseId },
        },
      },
    });
  }

  async rejectCaseRequest(requestId: bigint): Promise<void> {
    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
  }

  async getPendingCaseRequestsByLawyer(
    lawyerId: string,
  ): Promise<PrismaCaseRequestModel[]> {
    const pendingRequests = await this.#prisma.caseRequest.findMany({
      where: { lawyerId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
    });
    return pendingRequests;
  }
  async cancelCaseRequest(requestId: bigint): Promise<void> {
    // check if the request is still pending and it exists
    const request = await this.getCaseRequestById(requestId);
    if (!request || request.status !== 'PENDING') {
      throw new Error('Invalid request');
    }

    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }
}
