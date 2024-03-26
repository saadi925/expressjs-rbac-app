"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDBProfile = void 0;
const client_1 = require("@prisma/client");
class PrismaDBProfile {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    async createProfile(data, userId) {
        const pf = await this.#prisma.profile.upsert({
            where: { userId },
            update: { ...data },
            create: {
                ...data,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            },
        });
        return pf;
    }
    async updateProfile(userId, data) {
        return await this.#prisma.profile.update({
            where: { userId },
            data,
        });
    }
    async getProfileWithRole(userId) {
        return await this.#prisma.profile.findUnique({
            where: { userId },
            select: {
                id: true,
                displayname: true,
                createdAt: true,
                updatedAt: true,
                avatar: true,
                bio: true,
                location: true,
                phone: true,
                user: {
                    select: {
                        role: true,
                    },
                },
            },
        });
    }
    async setDisplayName(userId, displayname) {
        return await this.#prisma.profile.update({
            where: { userId },
            data: { displayname },
        });
    }
    async setBio(userId, bio) {
        return await this.#prisma.profile.update({
            where: { userId },
            data: { bio },
        });
    }
    async setAvatar(userId, avatar) {
        return await this.#prisma.profile.update({
            where: { userId },
            data: { avatar },
        });
    }
    async deleteProfile(userId) {
        return await this.#prisma.profile.delete({
            where: {
                id: userId,
            },
        });
    }
}
exports.PrismaDBProfile = PrismaDBProfile;
