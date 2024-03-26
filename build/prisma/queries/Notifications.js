"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaNotification = void 0;
const client_1 = require("@prisma/client");
class PrismaNotification {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async createNotification(data) {
        const createdNotification = await this.#prisma.notification.create({
            data,
        });
        return createdNotification;
    }
    async getNotifications(userId) {
        const notifications = await this.#prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }, // Order notifications by creation date in descending order
        });
        return notifications;
    }
    async markNotificationAsRead(notificationId, userId) {
        await this.#prisma.notification.update({
            where: { id: notificationId, userId },
            data: { read: true },
        });
    }
    async deleteNotification(notificationId, userId) {
        await this.#prisma.notification.delete({
            where: { id: notificationId, userId },
        });
    }
    async deleteAllUserNotifications(userId) {
        await this.#prisma.notification.deleteMany({ where: { userId } });
    }
    async getUnreadNotifications(userId) {
        const unreadNotifications = await this.#prisma.notification.findMany({
            where: { userId, read: false },
            orderBy: { createdAt: 'desc' }, // Order notifications by creation date in descending order
        });
        return unreadNotifications;
    }
}
exports.PrismaNotification = PrismaNotification;
