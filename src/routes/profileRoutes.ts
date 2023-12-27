import express from 'express';
import {
  createProfile,
  updateProfileHandler,
  getUserProfile,
} from '../handlers/profileHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const r = express.Router();
r.get('/', authMiddleware, getUserProfile);
r.post('/', authMiddleware, createProfile);
r.put('/', authMiddleware, updateProfileHandler);

export { r as profileRoutes };
