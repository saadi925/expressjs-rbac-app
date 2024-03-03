import { Request, Response, NextFunction } from 'express';
import { newEnforcer } from 'casbin';
import { rbacConfig } from '../../config/keys';
interface RequestWithUser extends Request {
  userId?: string;
  userRole?: 'LAWYER' | 'CLIENT';
}

export const RBACMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const enforcer = await newEnforcer(rbacConfig.model, rbacConfig.policy);
  const { userRole } = req;
  const path = req.originalUrl;
  const method = req.method;

  if (!(await enforcer.enforce(userRole, path, method))) {
    return res.status(403).send('Forbidden');
  }
  next();
};
//  if request has an id , it will return true otherwise it will return error
export function checkForUser(req: RequestWithUser, res: Response): boolean {
  const { userId } = req;
  if (!userId || typeof userId !== 'string') {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
