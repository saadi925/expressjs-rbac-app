import express from 'express';
import {
  updateProfileHandler,
  getUserProfile,
  createOrUpdateProfile,
  uploadAvatar,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import { upload } from '../../src/utils/storage';

const r = express.Router();
r.post('/avatar', authMiddleware, upload.single('avatar') , uploadAvatar)
r.get('/', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createOrUpdateProfile);
r.put('/', authMiddleware, updateProfileHandler);

export { r as profileRoutes };
