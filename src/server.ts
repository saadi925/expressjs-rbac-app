import express from 'express';
import {
  authRoutes,
  profileRoutes,
  clientRoutes,
  lawyerRoutes,
} from './routes';
import bodyParser from 'body-parser';
import { notificationRoutes } from './routes/notificationRoutes';
import { friendRequestsRoutes } from './routes/friendRequestRoutes';
export const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/user/profile', profileRoutes);
app.use('/notifications', notificationRoutes);
app.use('/friend_requests', friendRequestsRoutes);

app.use('/client', clientRoutes);
app.use('/lawyer', lawyerRoutes);
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running... on port ${port}`));
