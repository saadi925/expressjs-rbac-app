// messagesController.ts
import { Request, Response } from 'express';
import { PrismaMessages } from '../../prisma/queries/PrismaMessages';
import { RequestWithUser } from 'types/profile';

const prismaMessages = new PrismaMessages();

export async function sendMessage(req: Request, res: Response) {
  try {
    const { senderId, receiverId, content } = req.body;
    const message = await prismaMessages.sendMessage(
      senderId,
      receiverId,
      content,
    );
    res.status(201).json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function markMessageAsSeen(req: Request, res: Response) {
  try {
    const { messageId } = req.params;
    await prismaMessages.markMessageAsSeen(messageId);
    res.status(200).json({ message: 'Message marked as seen' });
  } catch (error) {
    console.error('Error marking message as seen:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMessages(req: RequestWithUser, res: Response) {
  try {
    const { userId } = req;
    if (!userId || typeof userId !== 'string') {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }
    const { recieverId } = req.body;
    const messages = await prismaMessages.getMessages(
      userId,
      recieverId,
    );
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
