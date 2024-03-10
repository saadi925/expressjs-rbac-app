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
var _PrismaCaseAttachment_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaCaseAttachment = void 0;
const client_1 = require("@prisma/client");
class PrismaCaseAttachment {
    constructor() {
        _PrismaCaseAttachment_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaCaseAttachment_prisma, new client_1.PrismaClient(), "f");
    }
    createCaseAttachment(data, caseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const attachment = yield __classPrivateFieldGet(this, _PrismaCaseAttachment_prisma, "f").attachment.create({
                    data: Object.assign(Object.assign({}, data), { case: { connect: { id: caseId } }, user: { connect: { id: userId } } }),
                });
                return attachment;
            }
            catch (error) {
                // Handle the error gracefully
                console.error('Error creating case attachment:', error);
                throw new Error('Failed to create case attachment');
            }
        });
    }
    getCaseAttachmentById(attachmentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = yield __classPrivateFieldGet(this, _PrismaCaseAttachment_prisma, "f").attachment.findUnique({
                where: { id: attachmentId, userId },
            });
            return attachment;
        });
    }
    updateCaseAttachment(attachmentId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = yield __classPrivateFieldGet(this, _PrismaCaseAttachment_prisma, "f").attachment.update({
                where: { id: attachmentId, userId },
                data,
            });
            return attachment;
        });
    }
    getCaseAttachments(caseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachments = yield __classPrivateFieldGet(this, _PrismaCaseAttachment_prisma, "f").attachment.findMany({
                where: {
                    caseId,
                    userId,
                },
            });
            return attachments;
        });
    }
    deleteCaseAttachment(attachmentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const attachment = yield __classPrivateFieldGet(this, _PrismaCaseAttachment_prisma, "f").attachment.delete({
                where: { id: attachmentId, userId },
            });
            return attachment;
        });
    }
}
exports.PrismaCaseAttachment = PrismaCaseAttachment;
_PrismaCaseAttachment_prisma = new WeakMap();
