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
exports.Notifications = void 0;
const Notifications_1 = require("../prisma/queries/Notifications");
class Notifications {
    constructor() {
        this.prismaNotification = new Notifications_1.PrismaNotification();
    }
    createNotfication(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prismaNotification.createNotification(data);
            }
            catch (error) {
                throw new Error('Error at creating notification :' + error);
            }
        });
    }
    friendRequestAcceptedNotify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your friend request to ${data.name} has been accepted.`;
            yield this.createNotfication(data);
            return message;
        });
    }
    friendRequestSent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your friend request has been sent to ${data.name}`;
            yield this.createNotfication(data);
            return message;
        });
    }
    friendRequestRecieve(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `${data.name} has sent you a friend request`;
            yield this.createNotfication(data);
            return message;
        });
    }
    friendRequestCancelledNotify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your friend request to ${data.name} has been cancelled.`;
            yield this.createNotfication(data);
            return message;
        });
    }
    friendRequestRejectedNotify(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = `Your friend request from ${data.name} has been rejected.`;
            yield this.createNotfication(data);
            return message;
        });
    }
}
exports.Notifications = Notifications;
