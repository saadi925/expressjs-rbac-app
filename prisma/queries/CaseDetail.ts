import { CaseDetail, PrismaClient } from '@prisma/client';

export type CaseDetailData = Omit<CaseDetail, 'id'>;

export class PrismaCaseDetail {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async createCaseDetail(data: CaseDetailData): Promise<CaseDetail> {
    const caseDetail = await this.#prisma.caseDetail.create({
      data,
    });
    return caseDetail;
  }

  async getCaseDetailById(caseDetailId: bigint): Promise<CaseDetail | null> {
    const caseDetail = await this.#prisma.caseDetail.findUnique({
      where: { id: caseDetailId },
    });
    return caseDetail;
  }

  async updateCaseDetail(
    caseDetailId: bigint,
    data: CaseDetailData,
  ): Promise<CaseDetail | null> {
    const caseDetail = await this.#prisma.caseDetail.update({
      where: { id: caseDetailId },
      data,
    });
    return caseDetail;
  }

  async deleteCaseDetail(caseDetailId: bigint): Promise<CaseDetail | null> {
    const caseDetail = await this.#prisma.caseDetail.delete({
      where: { id: caseDetailId },
    });
    return caseDetail;
  }
}
