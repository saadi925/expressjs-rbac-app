import express from 'express';
import {
  getUserProfile,
  createOrUpdateProfile,
  uploadAvatar,
  getOtherClientProfile,
  getOtherLawyerProfile,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const r = express.Router();
r.post('/avatar' , uploadAvatar)
r.get('/', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createOrUpdateProfile);
r.get('/client/:caseId', authMiddleware, getOtherClientProfile);
r.get('/lawyer/:profileId', authMiddleware, getOtherLawyerProfile);
export { r as profileRoutes };
