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
var _PrismaMessages_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaMessages = void 0;
// PrismaMessages.ts
const client_1 = require("@prisma/client");
class PrismaMessages {
    constructor() {
        _PrismaMessages_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaMessages_prisma, new client_1.PrismaClient(), "f");
    }
    sendMessage(senderId, receiverId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield __classPrivateFieldGet(this, _PrismaMessages_prisma, "f").message.create({
                data: {
                    content,
                    senderId,
                    receiverId,
                },
            });
            return message;
        });
    }
    markMessageAsSeen(messageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaMessages_prisma, "f").message.update({
                where: { id: messageId },
                data: { seen: true },
            });
        });
    }
    getMessages(userId, limit, offset) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = yield __classPrivateFieldGet(this, _PrismaMessages_prisma, "f").message.findMany({
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
        });
    }
}
exports.PrismaMessages = PrismaMessages;
_PrismaMessages_prisma = new WeakMap();
