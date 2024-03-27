import { PrismaMessages } from '../prisma/queries/PrismaMessages';
import { Server, Socket } from 'socket.io';
import { prisma } from '../prisma';
import xss from 'xss';
import emojiRegex from 'emoji-regex';

import {
  authSocketMiddleware,
  isAuthorizedSocket,
  SocketWithUser,
} from './middleware';

interface SendMessageData {
  receiverId: string;
  content: string;
}

class MessageHandler {
  private prismaMessages: PrismaMessages;
  private io: Server;

  constructor(io: Server) {
    this.prismaMessages = new PrismaMessages();
    this.io = io;
  }

  sendMessage = async (socket: SocketWithUser, data: SendMessageData) => {
    try {
      const { receiverId, content } = data;
      // Access sender ID from the authenticated socket
      const senderId = socket.userId;

      if (!senderId) {
        throw new Error('Sender ID not found');
      }
      const [sender, receiver] = await Promise.all([
        prisma.user.findUnique({ where: { id: senderId } }),
        prisma.user.findUnique({ where: { id: receiverId } }),
      ]);
      if (!sender || !receiver) {
        throw new Error('Sender or receiver does not exist');
      }
      const sanitizedContent = xss(content);
      const emojiRegexPattern = emojiRegex();
      const isValidEmoji = emojiRegexPattern.test(sanitizedContent);
      if (sanitizedContent.length > 1000) {
        throw new Error('Message exceeds maximum length');
      }
      if (isValidEmoji) {
        throw new Error('Invalid emoji');
      }

      const message = await this.prismaMessages.sendMessage(
        senderId,
        receiverId,
        sanitizedContent,
      );
      await Promise.all([
        prisma.user.update({
          where: { id: senderId },
          data: { sentMessages: { connect: { id: message.id } } },
        }),
        prisma.user.update({
          where: { id: receiverId },
          data: { receivedMessages: { connect: { id: message.id } } },
        }),
      ]);
      this.io.to(receiverId).emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  markMessageAsSeen = async (messageId: string) => {
    try {
      await this.prismaMessages.markMessageAsSeen(messageId);
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  };
}

export const socketHandler = (io: Server) => (socket: Socket) => {
  console.log('A user connected');
  const messageHandler = new MessageHandler(io);
  socket.use((packet, next) => {
    authSocketMiddleware(socket as SocketWithUser, (err) => {
      if (err) {
        console.error('Error in authMiddleware:', err);
        return next(err);
      }
      next();
    });
  });

  // Apply isAuthorized middleware to specific socket events
  socket.use((packet, next) => {
    const authorizedEvents = ['sendMessage', 'markMessageAsSeen'];
    if (authorizedEvents.includes(packet[0])) {
      isAuthorizedSocket(socket, next);
    } else {
      next();
    }
  });

  socket.on('sendMessage', (data: SendMessageData) =>
    messageHandler.sendMessage(socket as SocketWithUser, data),
  );
  socket.on('markMessageAsSeen', messageHandler.markMessageAsSeen);
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
