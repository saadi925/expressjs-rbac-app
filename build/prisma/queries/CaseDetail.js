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
var _PrismaCaseDetail_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseDetail = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseDetail {
    constructor() {
        _PrismaCaseDetail_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaCaseDetail_prisma, new client_1.PrismaClient(), "f");
    }
    createCaseDetail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseDetail = yield __classPrivateFieldGet(this, _PrismaCaseDetail_prisma, "f").caseDetail.create({
                data,
            });
            return caseDetail;
        });
    }
    getCaseDetailById(caseDetailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseDetail = yield __classPrivateFieldGet(this, _PrismaCaseDetail_prisma, "f").caseDetail.findUnique({
                where: { id: caseDetailId },
            });
            return caseDetail;
        });
    }
    updateCaseDetail(caseDetailId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseDetail = yield __classPrivateFieldGet(this, _PrismaCaseDetail_prisma, "f").caseDetail.update({
                where: { id: caseDetailId },
                data,
            });
            return caseDetail;
        });
    }
    deleteCaseDetail(caseDetailId) {
        return __awaiter(this, void 0, void 0, function* () {
            const caseDetail = yield __classPrivateFieldGet(this, _PrismaCaseDetail_prisma, "f").caseDetail.delete({
                where: { id: caseDetailId },
            });
            return caseDetail;
        });
    }
}
exports.PrismaCaseDetail = PrismaCaseDetail;
_PrismaCaseDetail_prisma = new WeakMap();
