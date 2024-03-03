import express from 'express';
import { authMiddleware } from '../../src/middleware/authMiddleware';
import {
  deleteAllUserNotifications,
  getNotifications,
  getUnReadNotifications,
  markNotificationAsRead,
  removeNotification,
} from '../../src/handlers/notificationHandler';

const router = express.Router();

router.get('/unread', authMiddleware, getUnReadNotifications);
router.get('/', authMiddleware, getNotifications);
router.put('/:notification_id', authMiddleware, markNotificationAsRead);
router.delete('/:notification_id', authMiddleware, removeNotification);
router.delete('/', authMiddleware, deleteAllUserNotifications);

export { router as notificationRoutes };
