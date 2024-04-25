import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socketIO';

const app = express();
import { friendRequestRoutes } from './routes/friendRequestRoutes';
import { getCities } from './utils/cities';
import { authMiddleware } from './middleware';
import {
  authRoutes,
  profileRoutes,
  clientRoutes,
  lawyerRoutes,
  commonRoutes,
  notificationRoutes,
} from './routes';

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(bodyParser.json({ limit: '35mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '35mb', parameterLimit: 50000 }));
app.use(express.json());

const server = http.createServer(app);
app.use('/uploads/avatars',express.static('uploads/avatars'));

app.use('/auth', authRoutes);
app.use('/user/profile', profileRoutes);
app.use('/notifications', notificationRoutes);
app.use('/client', clientRoutes);
app.use('/lawyer', lawyerRoutes);
app.use('/common', commonRoutes);
app.use('/friend-requests', authMiddleware, friendRequestRoutes);

app.use('/api/get-cities', getCities);


const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', socketHandler(io));


app.use((err: Error, _req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
