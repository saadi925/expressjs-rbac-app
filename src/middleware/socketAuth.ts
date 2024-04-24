import jwt from 'jsonwebtoken';
import { KEYS } from '../../config/keys';
import { SocketWithUser } from './isAuthorized';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
  role: 'LAWYER' | 'CLIENT';
}

export const authSocketMiddleware = (
  socket: SocketWithUser,
  next: (err?: any) => void,
) => {
  const token = socket.handshake.auth.token;

  if (!token || typeof token !== 'string') {
    return next(new Error('No token provided.'));
  }

  jwt.verify(token, KEYS.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error verifying JWT:', err);
      return next(new Error('Failed to authenticate token.'));
    }

    const { role, id } = decoded as DecodedToken;
    if (!role || !id) {
      return next(new Error('Not authorized.'));
    }

    if (!['LAWYER', 'CLIENT'].includes(role)) {
      return next(new Error('Not authorized.'));
    }
    console.log("id", id, "role", role);
    
    socket.userId = id;
    socket.userRole = role;
    console.log(socket.userId, 'authenticated');
    next();
  });
};
