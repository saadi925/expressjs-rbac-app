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

import { friendRequestRoutes } from './routes/friendRequestRoutes';
import { getCities } from './utils/cities';
import { authorizeApi } from './routes/authorizeRoutes';
import { authMiddleware } from './middleware';
app.get('/', (req, res) => {
  res.send('Hello World!');
});
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
io.on('connection', socketHandler(io));
app.use('/auth', authRoutes);
app.use('/api/user/authorize', authorizeApi);
app.use('/user/profile', profileRoutes);
app.use('/notifications', notificationRoutes);
app.use('/client', clientRoutes);
app.use('/lawyer', lawyerRoutes);
app.use('/common', commonRoutes);
app.use('/friend-requests', authMiddleware, friendRequestRoutes);
app.use('/api/get-cities', getCities);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
