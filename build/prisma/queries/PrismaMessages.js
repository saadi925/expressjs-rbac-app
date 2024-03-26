"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMessages = void 0;
// PrismaMessages.ts
const client_1 = require("@prisma/client");
class PrismaMessages {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async sendMessage(senderId, receiverId, content) {
        const message = await this.#prisma.message.create({
            data: {
                content,
                senderId,
                receiverId,
            },
        });
        return message;
    }
    async markMessageAsSeen(messageId) {
        await this.#prisma.message.update({
            where: { id: messageId },
            data: { seen: true },
        });
    }
    async getMessages(userId, limit, offset) {
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
exports.PrismaMessages = PrismaMessages;
