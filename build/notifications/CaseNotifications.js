"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseNotifications = void 0;
const Notifications_1 = require("./Notifications");
class CaseNotifications extends Notifications_1.Notifications {
    constructor() {
        super();
    }
    async caseAssignedNotifyClient(caseTitle, data) {
        const message = `Your case "${caseTitle}..." has been assigned to ${data.name}.`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    // CLIENT specific
    async caseCreation(caseTitle, data) {
        const message = `Your case "${caseTitle}..." has been created Successfully.`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    // CLIENT specific
    async caseDeletion(caseTitle, data) {
        const message = `Your case "${caseTitle}..." has been deleted Successfully.`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    // LAWYER specific
    async caseAssignedNotifyLawyer(caseTitle, data) {
        const message = `You have been assigned to ${caseTitle}... , Mr ${data.name}'s case`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    //  CLIENT specific
    async caseStatusUpdatedNotify(caseTitle, status, data) {
        const message = `The status of your case "${caseTitle}..." has been updated to "${status}".`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    //  CLIENT specific , on lawyer req creation
    async caseRequestNotifyClient(data) {
        const message = `Mr . ${data.name} wants to handle your case.Do you want him to handle your case?.`;
        await this.createNotfication({ ...data, message });
        return message;
    }
    //  CLIENT specific , on client's req creation
    async caseRequestNotifyLawyer(data) {
        const message = `Do you want to take the case of Mr. ${data.name} ? `;
        await this.createNotfication({ ...data, message });
        return message;
    }
    async caseRequestRejectedNotify(data) {
        const message = `Your case request has been rejected by Mr ${data.name}. `;
        await this.createNotfication({ ...data, message });
        return message;
    }
}
exports.CaseNotifications = CaseNotifications;
