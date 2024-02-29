import { Response } from 'express';
import { RequestWithUser } from 'types/profile';
export const assignCaseToLawyer = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
  } catch (error) {
    return res.status(401).send({ error: 'Internal Server Error' });
  }
};
