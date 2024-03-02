import { FriendRequest, PrismaClient } from '@prisma/client';
import { Notifications } from '../../notifications/Notifications';
import { PrismaFriendship } from './FriendShip';

export type FriendRequestData = Omit<FriendRequest, 'id'>;

export class PrismaFriendRequest {
  #prisma;
  #notifications;
  constructor() {
    this.#prisma = new PrismaClient();
    this.#notifications = new Notifications();
  }

  async #removeRequestFromSenderSent(friendRequest: FriendRequest) {
    await this.#prisma.user.update({
      where: { id: friendRequest.senderId },
      data: {
        sentFriendRequests: {
          disconnect: { id: friendRequest.id },
        },
      },
    });
  }

  async #removeFromRecieverRequests(friendRequest: FriendRequest) {
    await this.#prisma.user.update({
      where: { id: friendRequest.receiverId },
      data: {
        receivedFriendRequests: {
          disconnect: { id: friendRequest.id },
        },
      },
    });
  }

  async #addToSenderSentRequests(
    friendRequest: FriendRequest,
    senderId: string,
  ) {
    await this.#prisma.user.update({
      where: { id: senderId },
      data: {
        sentFriendRequests: {
          connect: { id: friendRequest.id },
        },
      },
    });
  }

  async #addToRecieverRequests(friendRequest: FriendRequest) {
    await this.#prisma.user.update({
      where: { id: friendRequest.receiverId },
      data: {
        receivedFriendRequests: {
          connect: { id: friendRequest.id },
        },
      },
    });
  }

  async getSenderId(requestId: bigint): Promise<string> {
    const request = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error('Friend request not found');
    }
    return request.senderId;
  }

  async getReceiverId(requestId: bigint): Promise<string> {
    const request = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });
    if (!request) {
      throw new Error('Friend request not found');
    }
    return request.receiverId;
  }

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequest> {
    const friendRequest = await this.#prisma.friendRequest.create({
      data: { senderId, receiverId },
    });
    await this.#addToSenderSentRequests(friendRequest, senderId);
    await this.#addToRecieverRequests(friendRequest);
    return friendRequest;
  }

  async acceptFriendRequest(requestId: bigint): Promise<void> {
    const friendRequest = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'ACCEPTED' },
    });
    const prismaFriendship = new PrismaFriendship();
    await prismaFriendship.createFriendship(
      friendRequest.senderId,
      friendRequest.receiverId,
    );
    // Add the friend request to the receiver's receivedFriendRequests list
    await this.#addToRecieverRequests(friendRequest);

    // Retrieve sender's information
    const senderId = friendRequest.senderId;
    const sender = await this.#prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });

    if (!sender) {
      throw new Error('Sender not found');
    }
    const receiverName = sender.name; // Assuming 'name' is the receiver's name field
    // Notify the sender about the accepted friend request
    if (receiverName) {
      await this.#notifications.friendRequestAcceptedNotify(
        receiverName,
        senderId,
      );
    }

    // Remove the friend request from the sender's sentFriendRequests list
    await this.#removeRequestFromSenderSent(friendRequest);
  }

  async rejectFriendRequest(requestId: bigint): Promise<void> {
    const friendRequest = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }
    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'REJECTED' },
    });
    await this.#removeRequestFromSenderSent(friendRequest);
  }

  async cancelFriendRequest(requestId: bigint): Promise<void> {
    const friendRequest = await this.#prisma.friendRequest.findUnique({
      where: { id: requestId },
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }
    await this.#prisma.friendRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' },
    });

    await this.#removeRequestFromSenderSent(friendRequest);
    await this.#removeFromRecieverRequests(friendRequest);
  }

  async getPendingFriendRequests(userId: string): Promise<FriendRequest[]> {
    const pendingRequests = await this.#prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return pendingRequests;
  }

  async userExists(userId: string): Promise<boolean> {
    const user = await this.#prisma.user.findUnique({ where: { id: userId } });
    return !!user;
  }
}
