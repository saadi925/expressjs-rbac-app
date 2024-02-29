import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { KEYS } from '../../config/keys';
import { RequestWithUser } from 'types/profile';
interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
  role: 'LAWYER' | 'CLIENT';
}

export const authMiddleware = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers['authorization'];

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
      console.log('err in authMiddleware: ', err);

      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }
    const { role, id } = decoded as DecodedToken;
    if (!role || !id) {
      return res.status(401).send({ auth: false, message: 'Not authorized.' });
    }
    if (!['LAWYER', 'CLIENT'].includes(role)) {
      return res.status(401).send({ auth: false, message: 'Not authorized.' });
    }

    req.userId = id;
    req.userRole = role;
    next();
  });
};
