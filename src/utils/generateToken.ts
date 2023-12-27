import jwt from 'jsonwebtoken';
import { IUser } from 'types/auth';

export const generateToken = (user: IUser) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'fA*&%23sha#@#',
    {
      expiresIn: '1d',
    },
  );
};
