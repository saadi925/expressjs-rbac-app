import express from 'express';
import {
  getUserProfile,
  createOrUpdateProfile,
  uploadAvatar,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';
// import { upload } from '../../src/utils/storage';

const r = express.Router();
r.post('/avatar' , uploadAvatar)
r.get('/', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createOrUpdateProfile);

export { r as profileRoutes };
