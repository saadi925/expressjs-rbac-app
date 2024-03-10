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
var _PrismaCase_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLawyerIdFromCase = exports.PrismaCase = void 0;
const client_1 = require("@prisma/client");
const _1 = require(".");
class PrismaCase {
    constructor() {
        _PrismaCase_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaCase_prisma, new client_1.PrismaClient(), "f");
    }
    caseExists(caseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const found = yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.findUnique({
                where: { id: caseId },
            });
            return !!found;
        });
    }
    getAllOpenCases(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cases = yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.findMany({
                where: {
                    lawyerId: null,
                    clientId: userId,
                    status: 'OPEN',
                },
                orderBy: { createdAt: 'desc' },
            });
            return cases;
        });
    }
    createCase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdCase = yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.create({
                data,
            });
            return createdCase;
        });
    }
    updateCase(data, caseID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.update({
                where: { id: caseID, clientId: data.clientId },
                data,
            });
        });
    }
    deleteCase(id, clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.delete({
                where: { id, clientId },
            });
        });
    }
    getCases(clientId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.findMany({
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
        });
    }
    getCaseByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.findUnique({
                where: { id },
            });
        });
    }
    addLawyerToCase(lawyerId, clientId, caseId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedCase = yield __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.update({
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
        });
    }
    updateCaseStatus(status, caseId, clientId) {
        return __classPrivateFieldGet(this, _PrismaCase_prisma, "f").case.update({
            data: { status },
            where: { id: caseId, clientId },
        });
    }
}
exports.PrismaCase = PrismaCase;
_PrismaCase_prisma = new WeakMap();
function getLawyerIdFromCase(caseId, clientId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the database to find the case with the specified ID
            const caseData = yield _1.prisma.case.findUnique({
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
    });
}
exports.getLawyerIdFromCase = getLawyerIdFromCase;
