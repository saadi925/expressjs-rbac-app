import { Request, Response } from 'express';
import { PrismaMessages } from '../prisma/queries/PrismaMessages';
import { Server, Socket } from 'socket.io';

export const socketHandler = (io: Server) => (socket: Socket) => {
  console.log('A user connected');
  async (req: Request, res: Response) => {
    try {
      const prismaMessages = new PrismaMessages();
      const { userId, pageNumber = 1, pageSize = 30 } = req.query;
      // Calculate skip based on page number and page size
      if (!userId || typeof userId !== 'string') {
        throw new Error('Unauthorized User');
      }
      const skip = (Number(pageNumber) - 1) * Number(pageSize);

      // Fetch older messages from the database based on pagination parameters
      const olderMessages = await prismaMessages.getMessages(
        userId,
        Number(pageSize),
        skip,
      );

      res.status(200).json(olderMessages);
    } catch (error) {
      console.error('Error fetching older messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      const prismaMessages = new PrismaMessages();
      const message = await prismaMessages.sendMessage(
        senderId,
        receiverId,
        content,
      );

      // Emit the message to the receiver
      io.to(receiverId).emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('markMessageAsSeen', async (messageId) => {
    try {
      const prismaMessages = new PrismaMessages();
      await prismaMessages.markMessageAsSeen(messageId);
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
};
