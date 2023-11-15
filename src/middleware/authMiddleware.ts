import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import {KEYS} from '../../config/keys';
interface DecodedToken {
  id: string;
  role: 'lawyer' | 'client';
  iat: number;
  exp: number;
}

// Extend the Request type
interface RequestWithUser extends Request {
  userId?: string;
  userRole?: 'lawyer' | 'client';
}

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'] as string;

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
  // split the token string with Bearer and the token itself
    const tokenParts = token.split(' ');
    const tokenString = tokenParts[1];
    const tokenType = tokenParts[0];
    if (tokenType !== 'Bearer') {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
  jwt.verify(tokenString, KEYS.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }

    const { role, id } = decoded as DecodedToken;

    if (!['lawyer', 'client'].includes(role)) {
      return res.status(401).send({ auth: false, message: 'Not authorized.' });
    }

    req.userId = id;
    req.userRole = role;
    next();
  });
};

