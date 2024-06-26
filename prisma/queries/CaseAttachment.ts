import { Attachment, PrismaClient } from '@prisma/client';

export type AttachmentData = Omit<
  Omit<Omit<Attachment, 'id'>, 'caseId'>,
  'userId'
>;

export class PrismaCaseAttachment {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
  }
  async createCaseAttachment(
    data: AttachmentData,
    caseId: bigint,
    userId: string,
  ): Promise<Attachment> {
    try {
      const attachment = await this.#prisma.attachment.create({
        data: {
          ...data,
          case: { connect: { id: caseId } },
          user: { connect: { id: userId } },
        },
      });
      return attachment;
    } catch (error) {
      // Handle the error gracefully
      console.error('Error creating case attachment:', error);
      throw new Error('Failed to create case attachment');
    }
  }

  async getCaseAttachmentById(
    attachmentId: bigint,
    userId: string,
  ): Promise<Attachment | null> {
    const attachment = await this.#prisma.attachment.findUnique({
      where: { id: attachmentId, userId },
    });
    return attachment;
  }

  async updateCaseAttachment(
    attachmentId: bigint,
    userId: string,
    data: AttachmentData,
  ): Promise<Attachment | null> {
    const attachment = await this.#prisma.attachment.update({
      where: { id: attachmentId, userId },
      data,
    });
    return attachment;
  }

  async getCaseAttachments(
    caseId: bigint,
    userId: string,
  ): Promise<Attachment[]> {
    const attachments = await this.#prisma.attachment.findMany({
      where: {
        caseId,
        userId,
      },
    });
    return attachments;
  }

  async deleteCaseAttachment(
    attachmentId: bigint,
    userId: string,
  ): Promise<Attachment | null> {
    const attachment = await this.#prisma.attachment.delete({
      where: { id: attachmentId, userId },
    });
    return attachment;
  }
}
