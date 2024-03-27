"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLawyerContact = void 0;
const client_1 = require("@prisma/client");
class PrismaLawyerContact {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createLawyerContact(data, userId) {
        try {
            const profile = await this.prisma.lawyerContact.upsert({
                where: { lawyerId: userId },
                update: { ...data, email: data.email },
                create: {
                    ...data,
                    email: data.email,
                },
            });
            return profile;
        }
        catch (error) {
            console.error('Error creating lawyer contact:', error);
            throw error;
        }
    }
    async getLawyerContactById(id) {
        try {
            const profile = await this.prisma.lawyerContact.findUnique({
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
    }
    async updateLawyerContact(userId, data) {
        try {
            const profile = await this.prisma.lawyerContact.update({
                where: { lawyerId: userId },
                data: {
                    ...data,
                    updatedAt: new Date(),
                },
            });
            return profile;
        }
        catch (error) {
            console.error('Error updating lawyer contact:', error);
            throw error;
        }
    }
    async deleteLawyerContact(userId) {
        try {
            const profile = await this.prisma.lawyerContact.delete({
                where: { lawyerId: userId },
            });
            return profile;
        }
        catch (error) {
            console.error('Error deleting lawyer contact:', error);
            throw error;
        }
    }
}
exports.PrismaLawyerContact = PrismaLawyerContact;
