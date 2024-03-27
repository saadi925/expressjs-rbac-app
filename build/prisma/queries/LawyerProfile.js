"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLawyerProfile = void 0;
const client_1 = require("@prisma/client");
class PrismaLawyerProfile {
    prisma;
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async createOrUpdateLawyerProfile(data) {
        try {
            client_1.$Enums.AvailabilityStatus;
            return await this.prisma.lawyerProfile.upsert({
                where: { userId: data.userId },
                update: { ...data },
                create: { ...data, isVerified: false },
            });
        }
        catch (error) {
            console.error('Error creating or updating lawyer profile:', error);
            throw new Error('Failed to create or update lawyer profile');
        }
    }
    async getLawyerProfileById(id) {
        const profile = await this.prisma.lawyerProfile.findUnique({
            where: { userId: id },
        });
        if (!profile) {
            throw new Error('Lawyer profile not found');
        }
        const c = this.prisma.lawyerProfile.findUnique({
            where: { id },
            select: {
                contact: true,
                description: true,
                experience: true,
                specialization: true,
                status: true,
            },
        });
        return c;
    }
    async updateLawyerProfile(id, data) {
        return this.prisma.lawyerProfile.update({ where: { id }, data });
    }
    async deleteLawyerProfile(id) {
        return this.prisma.lawyerProfile.delete({ where: { id } });
    }
    async getAllLawyerProfiles() {
        return this.prisma.lawyerProfile.findMany();
    }
}
exports.PrismaLawyerProfile = PrismaLawyerProfile;
