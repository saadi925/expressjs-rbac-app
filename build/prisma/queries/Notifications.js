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
var _PrismaNotification_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaNotification = void 0;
const client_1 = require("@prisma/client");
class PrismaNotification {
    constructor() {
        _PrismaNotification_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaNotification_prisma, new client_1.PrismaClient(), "f");
    }
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdNotification = yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.create({
                data,
            });
            return createdNotification;
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' }, // Order notifications by creation date in descending order
            });
            return notifications;
        });
    }
    markNotificationAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.update({
                where: { id: notificationId, userId },
                data: { read: true },
            });
        });
    }
    deleteNotification(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.delete({
                where: { id: notificationId, userId },
            });
        });
    }
    deleteAllUserNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.deleteMany({ where: { userId } });
        });
    }
    getUnreadNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const unreadNotifications = yield __classPrivateFieldGet(this, _PrismaNotification_prisma, "f").notification.findMany({
                where: { userId, read: false },
                orderBy: { createdAt: 'desc' }, // Order notifications by creation date in descending order
            });
            return unreadNotifications;
        });
    }
}
exports.PrismaNotification = PrismaNotification;
_PrismaNotification_prisma = new WeakMap();
