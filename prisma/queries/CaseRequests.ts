import {
  PrismaClient,
  CaseRequest as PrismaCaseRequestModel,
  CaseRequest,
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
  async removeRequestFromSenderSent(caseRequestId: bigint, userId: string) {
    await this.#prisma.user.update({
      where: { id: userId },
      data: {
        sentCaseRequests: {
          disconnect: { id: caseRequestId },
        },
      },
    });
  }
  async addToSenderSentRequests(caseRequestId: bigint, senderId: string) {
    await this.#prisma.user.update({
      where: { id: senderId },
      data: {
        sentCaseRequests: {
          connect: { id: caseRequestId },
        },
      },
    });
  }
  async addToRecieverRecieveRequests(
    caseRequestId: bigint,
    receiverId: string,
  ) {
    await this.#prisma.user.update({
      where: { id: receiverId },
      data: {
        receivedCaseRequests: {
          connect: { id: caseRequestId },
        },
      },
    });
  }

  async #removeFromRecieverRequests(caseRequest: CaseRequest, userId: string) {
    await this.#prisma.user.update({
      where: { id: userId },
      data: {
        receivedCaseRequests: {
          disconnect: { id: caseRequest.id },
        },
      },
    });
  }
  async createCaseRequest(data: CaseRequestData) {
    const createdCaseRequest = await this.#prisma.caseRequest.create({
      data,
      include: {
        lawyer: {
          select: { name: true },
        },
        client: {
          select: { name: true },
        },
      },
    });

    return createdCaseRequest;
  }

  async getCaseRequestById(requestId: bigint) {
    const caseRequest = await this.#prisma.caseRequest.findUnique({
      where: { id: requestId },
      include: {
        lawyer: { select: { name: true } },
        client: { select: { name: true } },
      },
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
      where: { id: lawyerId, role: 'LAWYER' },
      data: {
        lawyerCases: {
          connect: { id: caseId },
        },
      },
    });
  }
  async updateClientCases(clientId: string, caseId: bigint) {
    // Update client's cases
    await this.#prisma.user.update({
      where: { id: clientId, role: 'CLIENT' },
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
    await this.#prisma.caseRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });
  }
}
