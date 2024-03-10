"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../../src/middleware/authMiddleware");
const notificationHandler_1 = require("../../src/handlers/notificationHandler");
const router = express_1.default.Router();
exports.notificationRoutes = router;
router.get('/unread', authMiddleware_1.authMiddleware, notificationHandler_1.getUnReadNotifications);
router.get('/', authMiddleware_1.authMiddleware, notificationHandler_1.getNotifications);
router.put('/:notification_id', authMiddleware_1.authMiddleware, notificationHandler_1.markNotificationAsRead);
router.delete('/:notification_id', authMiddleware_1.authMiddleware, notificationHandler_1.removeNotification);
router.delete('/', authMiddleware_1.authMiddleware, notificationHandler_1.deleteAllUserNotifications);
