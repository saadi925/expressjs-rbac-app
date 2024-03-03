import path from 'path';
import { Request, Response } from 'express';
import {
  AttachmentData,
  PrismaCaseAttachment,
} from '../../prisma/queries/CaseAttachment';
import { RequestWithUser } from 'types/profile';
import fs from 'fs';
import { FileObject, RequestWithAttachment } from 'types/Attachments';
import { checkForUser } from '../../src/middleware/rbacMiddleware';
const UPLOADS_FOLDER = path.join(__dirname, '..', 'uploads');

const prismaCaseAttachment = new PrismaCaseAttachment();
export const uploadingCaseAttachments = async (
  req: RequestWithAttachment,
  res: Response,
) => {
  try {
    const { userId } = req;
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    const { caseId } = req.params;
    const file = req.file;
    if (!file) {
      return;
    }
    const { fileName, fileUrl } = file as FileObject;
    if (
      !fileName ||
      !fileName ||
      typeof fileName !== 'string' ||
      typeof fileUrl !== 'string'
    ) {
      return res.status(403).json({ error: 'Invalid File , Try Again' });
    }
    const data: AttachmentData = {
      fileUrl,
      fileName,
      uploadTime: new Date(),
    };
    await prismaCaseAttachment.createCaseAttachment(
      data, // Assuming you have other attachment data to include
      BigInt(caseId),
      userId as string,
    );

    res
      .status(201)
      .json({ message: 'File uploaded successfully', fileName, caseId });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
};

export const downloadingCaseAttachments = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const { filename } = req.params;
    const userId = req;
    if (!userId || typeof userId !== 'string') {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }
    // Construct the file path
    const filePath = path.join(UPLOADS_FOLDER, filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Download the file
    res.download(filePath, filename);
  } catch (error) {
    console.error('Error downloading attachment:', error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
};

export async function GetCaseAttachmentById(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const attachmentId = BigInt(req.params.attachmentId);
    const attachment =
      await prismaCaseAttachment.getCaseAttachmentById(attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    res.json(attachment);
  } catch (error) {
    console.error('Error retrieving attachment:', error);
    res.status(500).json({ error: 'Failed to retrieve attachment' });
  }
}

export async function updateCaseAttachment(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const attachmentId = BigInt(req.params.attachmentId);
    const { data } = req.body as { data: AttachmentData };
    const attachment = await prismaCaseAttachment.updateCaseAttachment(
      attachmentId,
      data,
    );
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    res.json(attachment);
  } catch (error) {
    console.error('Error updating attachment:', error);
    res.status(500).json({ error: 'Failed to update attachment' });
  }
}
export async function deleteCaseAttachment(
  req: RequestWithUser,
  res: Response,
) {
  try {
    const attachmentId = BigInt(req.params.attachmentId);
    const attachment =
      await prismaCaseAttachment.deleteCaseAttachment(attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
