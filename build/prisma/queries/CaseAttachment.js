"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseAttachment = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseAttachment {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async createCaseAttachment(data, caseId, userId) {
        try {
            const attachment = await this.#prisma.attachment.create({
                data: {
                    ...data,
                    case: { connect: { id: caseId } },
                    user: { connect: { id: userId } },
                },
            });
            return attachment;
        }
        catch (error) {
            // Handle the error gracefully
            console.error('Error creating case attachment:', error);
            throw new Error('Failed to create case attachment');
        }
    }
    async getCaseAttachmentById(attachmentId, userId) {
        const attachment = await this.#prisma.attachment.findUnique({
            where: { id: attachmentId, userId },
        });
        return attachment;
    }
    async updateCaseAttachment(attachmentId, userId, data) {
        const attachment = await this.#prisma.attachment.update({
            where: { id: attachmentId, userId },
            data,
        });
        return attachment;
    }
    async getCaseAttachments(caseId, userId) {
        const attachments = await this.#prisma.attachment.findMany({
            where: {
                caseId,
                userId,
            },
        });
        return attachments;
    }
    async deleteCaseAttachment(attachmentId, userId) {
        const attachment = await this.#prisma.attachment.delete({
            where: { id: attachmentId, userId },
        });
        return attachment;
    }
}
exports.PrismaCaseAttachment = PrismaCaseAttachment;
