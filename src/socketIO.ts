import { app } from './server';

import http from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const server = http.createServer(app);
const io = new Server(server);
const prisma = new PrismaClient();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async ({ senderId, receiverId, content }) => {
    try {
      const message = await prisma.message.create({
        data: {
          content,
          senderId,
          receiverId,
        },
      });

      // Emit the message to the receiver
      socket.to(receiverId).emit('message', message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
