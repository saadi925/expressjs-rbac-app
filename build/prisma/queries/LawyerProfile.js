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
exports.PrismaLawyerProfile = void 0;
const client_1 = require("@prisma/client");
class PrismaLawyerProfile {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    createOrUpdateLawyerProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.lawyerProfile.upsert({
                    where: { userId: data.userId },
                    update: Object.assign({}, data),
                    create: Object.assign(Object.assign({}, data), { isVerified: false }),
                });
            }
            catch (error) {
                console.error('Error creating or updating lawyer profile:', error);
                throw new Error('Failed to create or update lawyer profile');
            }
        });
    }
    getLawyerProfileById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.lawyerProfile.findUnique({ where: { id } });
        });
    }
    updateLawyerProfile(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.lawyerProfile.update({ where: { id }, data });
        });
    }
    deleteLawyerProfile(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.lawyerProfile.delete({ where: { id } });
        });
    }
    getAllLawyerProfiles() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.lawyerProfile.findMany();
        });
    }
}
exports.PrismaLawyerProfile = PrismaLawyerProfile;
