import {
  PrismaClient,
  Notification as PrismaNotificationModel,
} from '@prisma/client';

export interface NotificationData {
  userId: string;
  message: string;
  avatarUrl?: string;
  name?: string;
}

export class PrismaNotification {
  #prisma: PrismaClient;

  constructor() {
    this.#prisma = new PrismaClient();
  }

  async createNotification(
    data: NotificationData,
  ): Promise<PrismaNotificationModel> {
    const createdNotification = await this.#prisma.notification.create({
      data,
    });
    return createdNotification;
  }

  async getNotifications(userId: string) {
    const notifications = await this.#prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, 
    });
    return notifications;
  }

  async markNotificationAsRead(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    await this.#prisma.notification.update({
      where: { id: notificationId, userId },
      data: { read: true },
    });
  }

  async deleteNotification(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    await this.#prisma.notification.delete({
      where: { id: notificationId, userId },
    });
  }

  async deleteAllUserNotifications(userId: string): Promise<void> {
    await this.#prisma.notification.deleteMany({ where: { userId } });
  }

  async getUnreadNotifications(
    userId: string,
  ): Promise<PrismaNotificationModel[]> {
    const unreadNotifications = await this.#prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' }, // Order notifications by creation date in descending order
    });
    return unreadNotifications;
  }
}
