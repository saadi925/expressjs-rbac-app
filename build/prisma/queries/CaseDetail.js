"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseDetail = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseDetail {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async createCaseDetail(data) {
        const caseDetail = await this.#prisma.caseDetail.create({
            data,
        });
        return caseDetail;
    }
    async getCaseDetailById(caseDetailId) {
        const caseDetail = await this.#prisma.caseDetail.findUnique({
            where: { id: caseDetailId },
        });
        return caseDetail;
    }
    async updateCaseDetail(caseDetailId, data) {
        const caseDetail = await this.#prisma.caseDetail.update({
            where: { id: caseDetailId },
            data,
        });
        return caseDetail;
    }
    async deleteCaseDetail(caseDetailId) {
        const caseDetail = await this.#prisma.caseDetail.delete({
            where: { id: caseDetailId },
        });
        return caseDetail;
    }
}
exports.PrismaCaseDetail = PrismaCaseDetail;
