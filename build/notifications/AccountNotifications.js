"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountNotifications = void 0;
const Notifications_1 = require("./Notifications");
class AccountNotifications extends Notifications_1.Notifications {
    constructor() {
        super();
    }
    async paymentMethodAdded(payment, userId) {
        const message = `your payment method ${payment} has been added to your account`;
        await this.createNotfication({ message, userId });
        return message;
    }
    async passwordResetRequestNotify(userName, userId) {
        const message = `A password reset request has been initiated for your account, ${userName}.`;
        await this.createNotfication({ message, userId });
        return message;
    }
    async accountLockedNotify(userName, userId) {
        const message = `Your account, ${userName}, has been locked due to multiple failed login attempts.`;
        await this.createNotfication({ message, userId });
        return message;
    }
    async accountActivatedNotify(userName, userId) {
        const message = `Your account, ${userName}, has been activated successfully.`;
        await this.createNotfication({ message, userId });
        return message;
    }
    async emailVerifyNotification(email, userId) {
        const message = `Your email ${email} has been verified successfully`;
        await this.createNotfication({ message, userId });
        return message;
    }
    async verificationCodeNotify(email, userId) {
        const message = `A verification code has been sent to your email ${email} `;
        await this.createNotfication({ message, userId });
        return message;
    }
}
exports.AccountNotifications = AccountNotifications;
