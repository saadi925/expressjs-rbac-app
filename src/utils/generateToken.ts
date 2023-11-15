import jwt from 'jsonwebtoken';
import {IUserDocument} from '../models/UserSchema';

export const generateToken = (user: IUserDocument) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "fA*&%23sha#@#", {
    expiresIn: '1d',
  });
};
