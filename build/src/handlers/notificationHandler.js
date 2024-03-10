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
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeNotification = exports.getUnReadNotifications = exports.markNotificationAsRead = exports.deleteAllUserNotifications = exports.getNotifications = void 0;
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const Notifications_1 = require("../../prisma/queries/Notifications");
const prismaNotification = new Notifications_1.PrismaNotification();
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        const notifications = yield prismaNotification.getNotifications(userId);
        res.status(200).json({
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.getNotifications = getNotifications;
const deleteAllUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        yield prismaNotification.deleteAllUserNotifications(userId);
        res.status(200).json({
            message: 'notifications has been deleted successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.deleteAllUserNotifications = deleteAllUserNotifications;
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { notification_id } = req.params;
        const { userId } = req;
        yield prismaNotification.markNotificationAsRead(notification_id, userId);
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
const getUnReadNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { userId } = req;
        const notifications = yield prismaNotification.getUnreadNotifications(userId);
        res.status(200).json({
            notifications,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.getUnReadNotifications = getUnReadNotifications;
const removeNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!isOk) {
            return;
        }
        const { notification_id } = req.params;
        const { userId } = req;
        yield prismaNotification.deleteNotification(notification_id, userId);
        res.status(200).json({});
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
exports.removeNotification = removeNotification;
