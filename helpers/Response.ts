import { Response } from 'express';

export function RespondWithError(
  res: Response,
  code: number,
  errors: string | string[],
): Response<{ errors: [string] }> {
  return res.status(code).json({
    errors: [errors],
  });
}

export function RespondWithJson(res: Response, code: number, data: any) {
  res.status(code).json({
    data,
  });
}
