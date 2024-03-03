// PrismaMessages.ts
import { PrismaClient } from '@prisma/client';

export class PrismaMessages {
  #prisma;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const message = await this.#prisma.message.create({
      data: {
        content,
        senderId,
        receiverId,
      },
    });
    return message;
  }

  async markMessageAsSeen(messageId: string) {
    await this.#prisma.message.update({
      where: { id: messageId },
      data: { seen: true },
    });
  }

  async getMessages(userId: string, limit: number, offset: number) {
    const messages = await this.#prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
      skip: offset,
    });
    return messages;
  }
}
