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
exports.AccountNotifications = void 0;
const Notifications_1 = require("./Notifications");
class AccountNotifications extends Notifications_1.Notifications {
    constructor() {
        super();
    }
    paymentMethodAdded(payment, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `your payment method ${payment} has been added to your account`;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
    passwordResetRequestNotify(userName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `A password reset request has been initiated for your account, ${userName}.`;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
    accountLockedNotify(userName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your account, ${userName}, has been locked due to multiple failed login attempts.`;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
    accountActivatedNotify(userName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your account, ${userName}, has been activated successfully.`;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
    emailVerifyNotification(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your email ${email} has been verified successfully`;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
    verificationCodeNotify(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `A verification code has been sent to your email ${email} `;
            yield this.createNotfication({ message, userId });
            return message;
        });
    }
}
exports.AccountNotifications = AccountNotifications;
