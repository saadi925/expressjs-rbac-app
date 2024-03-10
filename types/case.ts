import { $Enums } from '@prisma/client';
import { RequestWithUser } from './profile';

export interface CaseCredentials {
  title: string;
  description: string;
  lawyerId: string | null;
  category: $Enums.CaseCategory;
}

export interface RequestWithCase extends RequestWithUser {
  body: CaseCredentials;
}
