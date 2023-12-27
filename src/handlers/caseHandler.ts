import { Response } from 'express';
import { createCase } from '../../prisma';
import { RequestWithCase } from 'types/case';

export const createCaseHandler = async (
  req: RequestWithCase,
  res: Response,
) => {
  const { title, description, status } = req.body;
  if (!req.userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  if (req.userRole == 'LAWYER')
    return res.status(403).json({ error: 'Unauthorized' });
  const clientId = req.userId;
  const data = {
    title,
    description,
    status,
    clientId,
    createdAt: new Date(),
    updatedAt: new Date(),
    lawyerId: null,
  };
  try {
    const createdCase = await createCase(data);
    res.status(201).json(createdCase);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};
