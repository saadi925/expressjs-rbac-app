"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseRequest = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseRequest {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async removeRequestFromSenderSent(caseRequestId, userId) {
        await this.#prisma.user.update({
            where: { id: userId },
            data: {
                sentCaseRequests: {
                    disconnect: { id: caseRequestId },
                },
            },
        });
    }
    async addToSenderSentRequests(caseRequestId, senderId) {
        await this.#prisma.user.update({
            where: { id: senderId },
            data: {
                sentCaseRequests: {
                    connect: { id: caseRequestId },
                },
            },
        });
    }
    async addToRecieverRecieveRequests(caseRequestId, receiverId) {
        await this.#prisma.user.update({
            where: { id: receiverId },
            data: {
                receivedCaseRequests: {
                    connect: { id: caseRequestId },
                },
            },
        });
    }
    async #removeFromRecieverRequests(caseRequest, userId) {
        await this.#prisma.user.update({
            where: { id: userId },
            data: {
                receivedCaseRequests: {
                    disconnect: { id: caseRequest.id },
                },
            },
        });
    }
    async createCaseRequest(data) {
        const createdCaseRequest = await this.#prisma.caseRequest.create({
            data,
            include: {
                lawyer: {
                    select: { name: true, profile: { select: { avatar: true } } },
                },
                client: {
                    select: { name: true, profile: { select: { avatar: true } } },
                },
            },
        });
        return createdCaseRequest;
    }
    async getCaseRequestByCaseAndLawyer(caseId, lawyerId) {
        const caseRequest = await this.#prisma.caseRequest.findFirst({
            where: {
                caseId: caseId,
                lawyerId: lawyerId,
            },
            include: { case: { select: { clientId: true, lawyerId: true } } },
        });
        return caseRequest;
    }
    async getCaseRequestByCaseAndClient(caseId, clientId) {
        const caseRequest = await this.#prisma.caseRequest.findFirst({
            where: {
                caseId: caseId,
                clientId: clientId,
            },
            include: { case: { select: { clientId: true, lawyerId: true } } },
        });
        return caseRequest;
    }
    async getCaseRequestById(requestId) {
        const caseRequest = await this.#prisma.caseRequest.findUnique({
            where: { id: requestId },
            include: {
                lawyer: {
                    select: { name: true, profile: { select: { avatar: true } } },
                },
                client: {
                    select: { name: true, profile: { select: { avatar: true } } },
                },
            },
        });
        return caseRequest;
    }
    async acceptCaseRequest(requestId) {
        const caseRequest = await this.getCaseRequestById(requestId);
        if (!caseRequest || caseRequest.status !== 'PENDING') {
            throw new Error('Invalid request');
        }
        await this.#prisma.caseRequest.update({
            where: { id: requestId },
            data: { status: 'ACCEPTED' },
        });
    }
    async updateLawyerCases(lawyerId, caseId) {
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
    async updateClientCases(clientId, caseId) {
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
    async rejectCaseRequest(requestId) {
        await this.#prisma.caseRequest.update({
            where: { id: requestId },
            data: { status: 'REJECTED' },
        });
    }
    async getPendingCaseRequestsByLawyer(lawyerId) {
        const pendingRequests = await this.#prisma.caseRequest.findMany({
            where: { lawyerId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                caseId: true,
                status: true,
                createdAt: true,
            },
        });
        return pendingRequests;
    }
    async getPendingCaseRequestsByClient(clientId) {
        const pendingRequests = await this.#prisma.caseRequest.findMany({
            where: { clientId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                caseId: true,
                status: true,
                createdAt: true,
            },
        });
        return pendingRequests;
    }
    async cancelCaseRequest(requestId) {
        await this.#prisma.caseRequest.update({
            where: { id: requestId },
            data: { status: 'CANCELLED' },
        });
    }
    async isInvolvementInCase(userId, caseId) {
        const isInvolvedInCase = await this.#prisma.caseRequest.findFirst({
            where: {
                OR: [
                    { clientId: userId, caseId },
                    { lawyerId: userId, caseId },
                ],
            },
        });
        return isInvolvedInCase;
    }
}
exports.PrismaCaseRequest = PrismaCaseRequest;
