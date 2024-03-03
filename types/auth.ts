import { User, $Enums } from '@prisma/client';
export type IUser = User;
export type userCredentials = {
  name: string;
  email: string;
  password: string;
  role?: $Enums.Role;
  verified: boolean;
};
