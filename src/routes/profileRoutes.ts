import express from 'express';
import {
  createProfile,
  updateProfileHandler,
  getUserProfile,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const r = express.Router();
r.get('/:id', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createProfile);
r.put('/:id', authMiddleware, updateProfileHandler);

export { r as profileRoutes };
