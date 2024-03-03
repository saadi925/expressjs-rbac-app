import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import {
  authRoutes,
  profileRoutes,
  clientRoutes,
  lawyerRoutes,
  commonRoutes,
  notificationRoutes,
} from './routes';
import { socketHandler } from './socketIO';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Configure middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Handle socket.io events
io.on('connection', socketHandler(io));

// Define routes
app.use('/auth', authRoutes);
app.use('/user/profile', profileRoutes);
app.use('/notifications', notificationRoutes);
app.use('/client', clientRoutes);
app.use('/lawyer', lawyerRoutes);
app.use('/common', commonRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server is running on port ${port}`));
