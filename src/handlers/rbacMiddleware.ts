import { Request, Response, NextFunction } from 'express';
import { newEnforcer } from 'casbin';
import { rbacConfig } from '../../config/keys';
interface RequestWithUser extends Request {
  userId?: string;
  userRole?: 'lawyer' | 'client';
}

export const RBACMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  const enforcer= await newEnforcer(rbacConfig.model, rbacConfig.policy);  
  const { userRole } = req; 
  const path = req.originalUrl;
  const method = req.method;

  if (!(await enforcer.enforce(userRole, path, method))) {
    return res.status(403).send('Forbidden');
  }
  next();
};


