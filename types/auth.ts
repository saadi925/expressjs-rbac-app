import { User } from '@prisma/client';
import { Request } from 'express';
export type IUser = User;
export type userCredentials = {
  name: string;
  email: string;
  password: string;
  role?: Role | any;
  verified: boolean;
};

enum Role {
  LAWYER,
  CLIENT,
}
