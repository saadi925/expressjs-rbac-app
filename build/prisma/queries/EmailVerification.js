"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerification = void 0;
const client_1 = require("@prisma/client");
class EmailVerification {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async genRandomCode() {
        // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
        const randomCode = Math.floor(100000 + Math.random() * 900000);
        return randomCode;
    }
    async createEmailVerification(data) {
        const createdEmailVerification = await this.#prisma.emailVerification.create({ data });
        return createdEmailVerification;
    }
    async createOrUpdateEmailVerification(data) {
        // First, try to find an existing email verification record for the user
        const existingRecord = await this.#prisma.emailVerification.findUnique({
            where: { userId: data.userId },
        });
        if (existingRecord) {
            // If an existing record is found, update it with the new data
            return await this.#prisma.emailVerification.update({
                where: { userId: data.userId },
                data,
            });
        }
        else {
            // If no existing record is found, create a new one
            return await this.#prisma.emailVerification.create({ data });
        }
    }
    async deleteEmailVerification(email, userId) {
        await this.#prisma.emailVerification.delete({ where: { email, userId } });
    }
    async getEmailVerifyById(userId) {
        return await this.#prisma.emailVerification.findUnique({
            where: {
                userId,
            },
        });
    }
    async getUserById(userId) {
        try {
            const user = await this.#prisma.user.findUnique({
                where: { id: userId },
            });
            return user;
        }
        catch (error) {
            console.error('Error fetching user by ID:', error);
            throw new Error('Failed to fetch user by ID');
        }
    }
    // Function to update the verify status of a user
    async updateUserVerifyStatus(userId, verified) {
        try {
            const updatedUser = await this.#prisma.user.update({
                where: { id: userId },
                data: { verified },
            });
            return updatedUser;
        }
        catch (error) {
            console.error('Error updating user verify status:', error);
            throw new Error('Failed to update user verify status');
        }
    }
}
exports.EmailVerification = EmailVerification;
