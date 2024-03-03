import { Request } from 'express';
import { RequestWithUser } from './profile';

// Define a type for the file object properties

export type FileObject = Express.Multer.File & {
  fileName: string;
  fileUrl: string;
};

export interface RequestWithAttachment extends RequestWithUser {
  file?: Express.Multer.File;
}
