import { RequestWithUser } from 'types/profile';
import { checkForUser } from './rbacMiddleware';
import { Response } from 'express';
import { PrismaNotification } from '../../prisma/queries/Notifications';

const prismaNotification = new PrismaNotification();
export const getNotifications = async (req: RequestWithUser, res: Response) => {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { userId } = req;
    const notifications = await prismaNotification.getNotifications(
      userId as string,
    );
    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
export const deleteAllUserNotifications = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { userId } = req;
    await prismaNotification.deleteAllUserNotifications(userId as string);
    res.status(200).json({
      message: 'notifications has been deleted successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
export const markNotificationAsRead = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { notification_id } = req.params;
    const { userId } = req;
    await prismaNotification.markNotificationAsRead(
      notification_id,
      userId as string,
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
export const getUnReadNotifications = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { userId } = req;
    const notifications = await prismaNotification.getUnreadNotifications(
      userId as string,
    );
    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
export const removeNotification = async (
  req: RequestWithUser,
  res: Response,
) => {
  try {
    const isOk = checkForUser(req, res);
    if (!isOk) {
      return;
    }
    const { notification_id } = req.params;
    const { userId } = req;
    await prismaNotification.deleteNotification(
      notification_id,
      userId as string,
    );
    res.status(200).json({});
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
