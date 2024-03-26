"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.getUnReadNotifications = exports.markNotificationAsRead = exports.deleteAllUserNotifications = exports.getNotifications = void 0;
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const Notifications_1 = require("../../prisma/queries/Notifications");
const prismaNotification = new Notifications_1.PrismaNotification();
const getNotifications = async (req, res) => {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        const notifications = await prismaNotification.getNotifications(userId);
        res.status(200).json({
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.getNotifications = getNotifications;
const deleteAllUserNotifications = async (req, res) => {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        await prismaNotification.deleteAllUserNotifications(userId);
        res.status(200).json({
            message: 'notifications has been deleted successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.deleteAllUserNotifications = deleteAllUserNotifications;
const markNotificationAsRead = async (req, res) => {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { notification_id } = req.params;
        const { userId } = req;
        await prismaNotification.markNotificationAsRead(notification_id, userId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.markNotificationAsRead = markNotificationAsRead;
const getUnReadNotifications = async (req, res) => {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        const notifications = await prismaNotification.getUnreadNotifications(userId);
        res.status(200).json({
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.getUnReadNotifications = getUnReadNotifications;
const removeNotification = async (req, res) => {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { notification_id } = req.params;
        const { userId } = req;
        await prismaNotification.deleteNotification(notification_id, userId);
        res.status(200).json({});
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};
exports.removeNotification = removeNotification;
