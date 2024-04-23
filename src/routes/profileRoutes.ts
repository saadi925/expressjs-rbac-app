import express from 'express';
import {
  getUserProfile,
  createOrUpdateProfile,
  uploadAvatar,
  getOtherClientProfile,
  getOtherLawyerProfile,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';
// import { upload } from '../../src/utils/storage';

const r = express.Router();
r.post('/avatar' , uploadAvatar)
r.get('/', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createOrUpdateProfile);
r.get('/:caseId', authMiddleware, getOtherClientProfile);
r.get('/:profileId', authMiddleware, getOtherLawyerProfile);
export { r as profileRoutes };
