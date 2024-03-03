import { $Enums } from '@prisma/client';
import { RequestWithUser } from './profile';

export interface CaseCredentials {
  title: string;
  description: string;
  status: $Enums.CaseStatus;
  lawyerId: string | null;
}

export interface RequestWithCase extends RequestWithUser {
  body: CaseCredentials;
}
