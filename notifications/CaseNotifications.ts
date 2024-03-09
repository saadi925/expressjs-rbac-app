import { NotificationData } from 'prisma/queries/Notifications';
import { Notifications } from './Notifications';

export class CaseNotifications extends Notifications {
  constructor() {
    super();
  }
  async caseAssignedNotifyClient(
    caseTitle: string,
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Your case "${caseTitle}..." has been assigned to ${data.name}.`;
    await this.createNotfication({ ...data, message });
    return message;
  }
  // CLIENT specific
  async caseCreation(
    caseTitle: string,
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Your case "${caseTitle}..." has been created Successfully.`;
    await this.createNotfication({ ...data, message });
    return message;
  }
  // CLIENT specific
  async caseDeletion(
    caseTitle: string,
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Your case "${caseTitle}..." has been deleted Successfully.`;
    await this.createNotfication({ ...data, message });
    return message;
  }
  // LAWYER specific
  async caseAssignedNotifyLawyer(
    caseTitle: string,
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `You have been assigned to ${caseTitle}... , Mr ${data.name}'s case`;
    await this.createNotfication({ ...data, message });
    return message;
  }
  //  CLIENT specific
  async caseStatusUpdatedNotify(
    caseTitle: string,
    status: string,
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `The status of your case "${caseTitle}..." has been updated to "${status}".`;

    await this.createNotfication({ ...data, message });
    return message;
  }
  //  CLIENT specific , on lawyer req creation
  async caseRequestNotifyClient(
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Mr . ${data.name} wants to handle your case.Do you want him to handle your case?.`;
    await this.createNotfication({ ...data, message });
    return message;
  }
  //  CLIENT specific , on client's req creation
  async caseRequestNotifyLawyer(
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Do you want to take the case of Mr. ${data.name} ? `;
    await this.createNotfication({ ...data, message });
    return message;
  }
  async caseRequestRejectedNotify(
    data: Omit<NotificationData, 'message'>,
  ): Promise<string> {
    const message = `Your case request has been rejected by Mr ${data.name}. `;
    await this.createNotfication({ ...data, message });
    return message;
  }
}
