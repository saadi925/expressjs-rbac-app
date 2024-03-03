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

export function generateVerificationToken(user: IUser, code: number) {
  return jwt.sign(
    { id: user.id, role: user.role, code },
    process.env.JWT_SECRET || 'fA*&%23sha#@#',
    {
      expiresIn: '10h',
    },
  );
}
