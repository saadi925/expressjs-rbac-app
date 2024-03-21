import { Notifications } from './Notifications';
export class AccountNotifications extends Notifications {
  constructor() {
    super();
  }
  async paymentMethodAdded(payment: string, userId: string): Promise<string> {
    const message = `your payment method ${payment} has been added to your account`;
    await this.createNotfication({ message, userId });
    return message;
  }
  async passwordResetRequestNotify(
    userName: string,
    userId: string,
  ): Promise<string> {
    const message = `A password reset request has been initiated for your account, ${userName}.`;
    await this.createNotfication({ message, userId });
    return message;
  }

  async accountLockedNotify(userName: string, userId: string): Promise<string> {
    const message = `Your account, ${userName}, has been locked due to multiple failed login attempts.`;
    await this.createNotfication({ message, userId });
    return message;
  }

  async accountActivatedNotify(
    userName: string,
    userId: string,
  ): Promise<string> {
    const message = `Your account, ${userName}, has been activated successfully.`;
    await this.createNotfication({ message, userId });
    return message;
  }

  async emailVerifyNotification(
    email: string,
    userId: string,
  ): Promise<string> {
    const message = `Your email ${email} has been verified successfully`;
    await this.createNotfication({ message, userId });
    return message;
  }
  async verificationCodeNotify(email: string, userId: string): Promise<string> {
    const message = `A verification code has been sent to your email ${email} `;
    await this.createNotfication({ message, userId });
    return message;
  }
}
