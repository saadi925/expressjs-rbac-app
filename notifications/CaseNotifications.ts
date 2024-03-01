import { Notifications } from './Notifications';

export class CaseNotifications extends Notifications {
  constructor() {
    super();
  }
  async caseAssignedNotifyClient(
    caseTitle: string,
    lawyerName: string,
    userId: string,
  ): Promise<string> {
    const message = `Your case "${caseTitle}..." has been assigned to ${lawyerName}.`;
    await this.createNotfication(message, userId);
    return message;
  }
  async caseCreation(caseTitle: string, userId: string): Promise<string> {
    const message = `Your case "${caseTitle}..." has been created Successfully.`;
    await this.createNotfication(message, userId);
    return message;
  }
  async caseDeletion(caseTitle: string, userId: string): Promise<string> {
    const message = `Your case "${caseTitle}..." has been deleted Successfully.`;
    await this.createNotfication(message, userId);
    return message;
  }
  async caseAssignedNotifyLawyer(
    caseTitle: string,
    clientName: string,
    userId: string,
  ): Promise<string> {
    const message = `You have been assigned to ${caseTitle}... , Mr ${clientName}'s case`;
    await this.createNotfication(message, userId);
    return message;
  }

  async caseStatusUpdatedNotify(
    caseTitle: string,
    status: string,
    userId: string,
  ): Promise<string> {
    const message = `The status of your case "${caseTitle}..." has been updated to "${status}".`;

    await this.createNotfication(message, userId);
    return `The status of your case "${caseTitle}..." has been updated to "${status}".`;
  }
  async caseRequestNotify(lawyerName: string, userId: string): Promise<string> {
    const message = `Mr . ${lawyerName} (lawyer) wants to handle your case.Do you want him to handle your case?.`;
    await this.createNotfication(message, userId);
    return message;
  }
  async caseRequestRejectedNotify(
    lawyerName: string,
    userId: string,
  ): Promise<string> {
    const message = `Your case request has been rejected by Mr ${lawyerName}. `;
    await this.createNotfication(message, userId);
    return message;
  }
}
