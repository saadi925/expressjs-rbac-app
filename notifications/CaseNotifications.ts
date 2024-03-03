import { Notifications } from './Notifications';

export class CaseNotifications extends Notifications {
  constructor() {
    super();
  }
  async caseAssignedNotifyClient(
    caseTitle: string,
    lawyerName: string,
    clientId: string,
  ): Promise<string> {
    const message = `Your case "${caseTitle}..." has been assigned to ${lawyerName}.`;
    await this.createNotfication(message, clientId);
    return message;
  }
  // CLIENT specific
  async caseCreation(caseTitle: string, clientId: string): Promise<string> {
    const message = `Your case "${caseTitle}..." has been created Successfully.`;
    await this.createNotfication(message, clientId);
    return message;
  }
  // CLIENT specific
  async caseDeletion(caseTitle: string, clientId: string): Promise<string> {
    const message = `Your case "${caseTitle}..." has been deleted Successfully.`;
    await this.createNotfication(message, clientId);
    return message;
  }
  // LAWYER specific
  async caseAssignedNotifyLawyer(
    caseTitle: string,
    clientName: string,
    lawyerId: string,
  ): Promise<string> {
    const message = `You have been assigned to ${caseTitle}... , Mr ${clientName}'s case`;
    await this.createNotfication(message, lawyerId);
    return message;
  }
  //  CLIENT specific
  async caseStatusUpdatedNotify(
    caseTitle: string,
    status: string,
    clientId: string,
  ): Promise<string> {
    const message = `The status of your case "${caseTitle}..." has been updated to "${status}".`;

    await this.createNotfication(message, clientId);
    return message;
  }
  //  CLIENT specific , on lawyer req creation
  async caseRequestNotifyClient(
    lawyerName: string,
    clientId: string,
  ): Promise<string> {
    const message = `Mr . ${lawyerName} wants to handle your case.Do you want him to handle your case?.`;
    await this.createNotfication(message, clientId);
    return message;
  }
  //  CLIENT specific , on client's req creation
  async caseRequestNotifyLawyer(
    clientName: string,
    lawyerId: string,
  ): Promise<string> {
    const message = `Do you want to take the case of Mr. ${clientName} ? `;
    await this.createNotfication(message, lawyerId);
    return message;
  }
  async caseRequestRejectedNotify(
    userName: string,
    userId: string,
  ): Promise<string> {
    const message = `Your case request has been rejected by Mr ${userName}. `;
    await this.createNotfication(message, userId);
    return message;
  }
}
