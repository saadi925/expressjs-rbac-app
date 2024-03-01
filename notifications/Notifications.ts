import { PrismaNotification } from 'prisma/queries/Notifications';

export class Notifications {
  prismaNotification;
  constructor() {
    this.prismaNotification = new PrismaNotification();
  }
  async createNotfication(message: string, userId: string) {
    try {
      await this.prismaNotification.createNotification({ message, userId });
    } catch (error) {
      throw new Error('Error at creating notification :' + error);
    }
  }
  async friendRequestAcceptedNotify(
    userName: string,
    userId: string,
  ): Promise<String> {
    const message = `Your friend request from ${userName} has been accepted.`;
    await this.createNotfication(message, userId);
    return message;
  }

  async friendRequestRejectedNotify(
    userName: string,
    userId: string,
  ): Promise<string> {
    const message = `Your friend request from ${userName} has been rejected.`;
    await this.createNotfication(message, userId);
    return message;
  }
}
