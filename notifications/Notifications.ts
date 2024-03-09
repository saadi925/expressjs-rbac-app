import {
  NotificationData,
  PrismaNotification,
} from '../prisma/queries/Notifications';

export class Notifications {
  prismaNotification;
  constructor() {
    this.prismaNotification = new PrismaNotification();
  }
  async createNotfication(data: NotificationData) {
    try {
      await this.prismaNotification.createNotification(data);
    } catch (error) {
      throw new Error('Error at creating notification :' + error);
    }
  }
  async friendRequestAcceptedNotify(data: NotificationData): Promise<String> {
    const message = `Your friend request to ${data.name} has been accepted.`;
    await this.createNotfication(data);
    return message;
  }
  async friendRequestSent(data: NotificationData) {
    const message = `Your friend request has been sent to ${data.name}`;
    await this.createNotfication(data);
    return message;
  }
  async friendRequestRecieve(data: NotificationData) {
    const message = `${data.name} has sent you a friend request`;
    await this.createNotfication(data);
    return message;
  }
  async friendRequestCancelledNotify(data: NotificationData): Promise<string> {
    const message = `Your friend request to ${data.name} has been cancelled.`;
    await this.createNotfication(data);
    return message;
  }
  async friendRequestRejectedNotify(data: NotificationData): Promise<string> {
    const message = `Your friend request from ${data.name} has been rejected.`;
    await this.createNotfication(data);
    return message;
  }
}
