"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PrismaCaseRequest_instances, _PrismaCaseRequest_prisma, _PrismaCaseRequest_removeFromRecieverRequests;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseRequest = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseRequest {
    constructor() {
        _PrismaCaseRequest_instances.add(this);
        _PrismaCaseRequest_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaCaseRequest_prisma, new client_1.PrismaClient(), "f");
    }
    removeRequestFromSenderSent(caseRequestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
                where: { id: userId },
                data: {
                    sentCaseRequests: {
                        disconnect: { id: caseRequestId },
                    },
                },
            });
        });
    }
    addToSenderSentRequests(caseRequestId, senderId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
                where: { id: senderId },
                data: {
                    sentCaseRequests: {
                        connect: { id: caseRequestId },
                    },
                },
            });
        });
    }
    addToRecieverRecieveRequests(caseRequestId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
                where: { id: receiverId },
                data: {
                    receivedCaseRequests: {
                        connect: { id: caseRequestId },
                    },
                },
            });
        });
    }
    createCaseRequest(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCaseRequest = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.create({
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
        });
    }
    getCaseRequestByCaseAndLawyer(caseId, lawyerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseRequest = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.findFirst({
                where: {
                    caseId: caseId,
                    lawyerId: lawyerId,
                },
                include: { case: { select: { clientId: true, lawyerId: true } } },
            });
            return caseRequest;
        });
    }
    getCaseRequestByCaseAndClient(caseId, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseRequest = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.findFirst({
                where: {
                    caseId: caseId,
                    clientId: clientId,
                },
                include: { case: { select: { clientId: true, lawyerId: true } } },
            });
            return caseRequest;
        });
    }
    getCaseRequestById(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseRequest = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.findUnique({
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
        });
    }
    acceptCaseRequest(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseRequest = yield this.getCaseRequestById(requestId);
            if (!caseRequest || caseRequest.status !== 'PENDING') {
                throw new Error('Invalid request');
            }
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.update({
                where: { id: requestId },
                data: { status: 'ACCEPTED' },
            });
        });
    }
    updateLawyerCases(lawyerId, caseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update lawyer's cases
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
                where: { id: lawyerId, role: 'LAWYER' },
                data: {
                    lawyerCases: {
                        connect: { id: caseId },
                    },
                },
            });
        });
    }
    updateClientCases(clientId, caseId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update client's cases
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
                where: { id: clientId, role: 'CLIENT' },
                data: {
                    clientCases: {
                        // Use the correct relation field name
                        connect: { id: caseId },
                    },
                },
            });
        });
    }
    rejectCaseRequest(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.update({
                where: { id: requestId },
                data: { status: 'REJECTED' },
            });
        });
    }
    getPendingCaseRequestsByLawyer(lawyerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingRequests = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.findMany({
                where: { lawyerId, status: 'PENDING' },
                orderBy: { createdAt: 'desc' },
            });
            return pendingRequests;
        });
    }
    cancelCaseRequest(requestId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.update({
                where: { id: requestId },
                data: { status: 'CANCELLED' },
            });
        });
    }
    isInvolvementInCase(userId, caseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isInvolvedInCase = yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").caseRequest.findFirst({
                where: {
                    OR: [
                        { clientId: userId, caseId },
                        { lawyerId: userId, caseId },
                    ],
                },
            });
            return isInvolvedInCase;
        });
    }
}
exports.PrismaCaseRequest = PrismaCaseRequest;
_PrismaCaseRequest_prisma = new WeakMap(), _PrismaCaseRequest_instances = new WeakSet(), _PrismaCaseRequest_removeFromRecieverRequests = function _PrismaCaseRequest_removeFromRecieverRequests(caseRequest, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield __classPrivateFieldGet(this, _PrismaCaseRequest_prisma, "f").user.update({
            where: { id: userId },
            data: {
                receivedCaseRequests: {
                    disconnect: { id: caseRequest.id },
                },
            },
        });
    });
};
