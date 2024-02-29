import express from 'express';
import {
  createProfile,
  updateProfileHandler,
  getUserProfile,
  deleteUserProfile,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const r = express.Router();
r.get('/:id', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createProfile);
r.put('/:id', authMiddleware, updateProfileHandler);
r.delete('/:id', authMiddleware, deleteUserProfile);

export { r as profileRoutes };
