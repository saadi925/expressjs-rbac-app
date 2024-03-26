"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = void 0;
const Notifications_1 = require("../prisma/queries/Notifications");
class Notifications {
    prismaNotification;
    constructor() {
        this.prismaNotification = new Notifications_1.PrismaNotification();
    }
    async createNotfication(data) {
        try {
            await this.prismaNotification.createNotification(data);
        }
        catch (error) {
            throw new Error('Error at creating notification :' + error);
        }
    }
    async friendRequestAcceptedNotify(data) {
        const message = `Your friend request to ${data.name} has been accepted.`;
        await this.createNotfication(data);
        return message;
    }
    async friendRequestSent(data) {
        const message = `Your friend request has been sent to ${data.name}`;
        await this.createNotfication(data);
        return message;
    }
    async friendRequestRecieve(data) {
        const message = `${data.name} has sent you a friend request`;
        await this.createNotfication(data);
        return message;
    }
    async friendRequestCancelledNotify(data) {
        const message = `Your friend request to ${data.name} has been cancelled.`;
        await this.createNotfication(data);
        return message;
    }
    async friendRequestRejectedNotify(data) {
        const message = `Your friend request from ${data.name} has been rejected.`;
        await this.createNotfication(data);
        return message;
    }
}
exports.Notifications = Notifications;
