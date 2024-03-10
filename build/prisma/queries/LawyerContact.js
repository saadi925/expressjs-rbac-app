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
exports.LawyerContact = void 0;
const client_1 = require("@prisma/client");
class LawyerContact {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createLawyerContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.prisma.lawyerContact.create({
                    data: Object.assign(Object.assign({}, data), { createdAt: new Date(), updatedAt: new Date() }),
                });
                return profile;
            }
            catch (error) {
                console.error('Error creating lawyer contact:', error);
                throw error;
            }
        });
    }
    getLawyerContactById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.prisma.lawyerContact.findUnique({
                    where: {
                        id,
                    },
                });
                return profile;
            }
            catch (error) {
                console.error('Error fetching lawyer contact:', error);
                throw error;
            }
        });
    }
    updateLawyerContact(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.prisma.lawyerContact.update({
                    where: { lawyerId: userId },
                    data: Object.assign(Object.assign({}, data), { updatedAt: new Date() }),
                });
                return profile;
            }
            catch (error) {
                console.error('Error updating lawyer contact:', error);
                throw error;
            }
        });
    }
    deleteLawyerContact(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const profile = yield this.prisma.lawyerContact.delete({
                    where: { lawyerId: userId },
                });
                return profile;
            }
            catch (error) {
                console.error('Error deleting lawyer contact:', error);
                throw error;
            }
        });
    }
}
exports.LawyerContact = LawyerContact;
