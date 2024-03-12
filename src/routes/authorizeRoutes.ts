import express from 'express';
import { authorizeAction } from '../../src/handlers/authorization';
import { authMiddleware } from '../../src/middleware/authMiddleware';

const router = express.Router();

router.get('/', authMiddleware, authorizeAction);

export { router as authorizeApi };
