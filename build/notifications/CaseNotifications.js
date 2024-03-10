"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseNotifications = void 0;
const Notifications_1 = require("./Notifications");
class CaseNotifications extends Notifications_1.Notifications {
    constructor() {
        super();
    }
    caseAssignedNotifyClient(caseTitle, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your case "${caseTitle}..." has been assigned to ${data.name}.`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    // CLIENT specific
    caseCreation(caseTitle, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your case "${caseTitle}..." has been created Successfully.`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    // CLIENT specific
    caseDeletion(caseTitle, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your case "${caseTitle}..." has been deleted Successfully.`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    // LAWYER specific
    caseAssignedNotifyLawyer(caseTitle, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `You have been assigned to ${caseTitle}... , Mr ${data.name}'s case`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    //  CLIENT specific
    caseStatusUpdatedNotify(caseTitle, status, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `The status of your case "${caseTitle}..." has been updated to "${status}".`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    //  CLIENT specific , on lawyer req creation
    caseRequestNotifyClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Mr . ${data.name} wants to handle your case.Do you want him to handle your case?.`;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    //  CLIENT specific , on client's req creation
    caseRequestNotifyLawyer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Do you want to take the case of Mr. ${data.name} ? `;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
    caseRequestRejectedNotify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your case request has been rejected by Mr ${data.name}. `;
            yield this.createNotfication(Object.assign(Object.assign({}, data), { message }));
            return message;
        });
    }
}
exports.CaseNotifications = CaseNotifications;
