import express from 'express';
import {
  getAllFriendshipsByUserId,
  getCaseStatuses,
} from '../../src/handlers/api';
import { authMiddleware } from '../../src/middleware/authMiddleware';
import { RBACMiddleware } from 'src/handlers/rbacMiddleware';
import { assignCaseToLawyer } from 'src/handlers/caseAssign';

const router = express.Router();
//  get the statuses available for case
router.get('/case_statuses', authMiddleware, getCaseStatuses);

// get all the friendships for a user
router.get('/friends', authMiddleware, getAllFriendshipsByUserId);

router.put(
  '/assign_case_to_lawyer',
  authMiddleware,
  RBACMiddleware,
  assignCaseToLawyer,
);
