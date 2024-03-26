"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLawyerIdFromCase = exports.PrismaCase = void 0;
const client_1 = require("@prisma/client");
const _1 = require(".");
class PrismaCase {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async caseExists(caseId) {
        const found = await this.#prisma.case.findUnique({
            where: { id: caseId },
        });
        return !!found;
    }
    async getAllOpenCases(userId) {
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
    async createCase(data) {
        const createdCase = await this.#prisma.case.create({
            data,
        });
        return createdCase;
    }
    async updateCase(data, caseID) {
        return await this.#prisma.case.update({
            where: { id: caseID, clientId: data.clientId },
            data,
        });
    }
    async deleteCase(id, clientId) {
        return await this.#prisma.case.delete({
            where: { id, clientId },
        });
    }
    async getCases(clientId) {
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
    async getCaseByID(id) {
        return await this.#prisma.case.findUnique({
            where: { id },
        });
    }
    async addLawyerToCase(lawyerId, clientId, caseId, status) {
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
    updateCaseStatus(status, caseId, clientId) {
        return this.#prisma.case.update({
            data: { status },
            where: { id: caseId, clientId },
        });
    }
}
exports.PrismaCase = PrismaCase;
async function getLawyerIdFromCase(caseId, clientId) {
    try {
        // Query the database to find the case with the specified ID
        const caseData = await _1.prisma.case.findUnique({
            where: { id: caseId, clientId },
            select: { clientId: true, lawyerId: true },
        });
        if (!caseData) {
            return null; // Case not found
        }
        // Return the lawyer ID from the case
        return caseData.lawyerId;
    }
    catch (error) {
        console.error('Error fetching lawyer ID from case:', error);
        throw error;
    }
}
exports.getLawyerIdFromCase = getLawyerIdFromCase;
