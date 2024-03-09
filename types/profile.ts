import { Request } from 'express';
// Extend the Request type
export interface RequestWithUser extends Request {
  userId?: string;
  userRole?: 'LAWYER' | 'CLIENT';
}
export interface ProfileCredentials {
  location: string | null;
  bio: string | null;
  avatar: string | null;
  displayname: string | null;
  phone: string | null;
}

export interface RequestWithProfile extends RequestWithUser {
  body: ProfileCredentials;
}
