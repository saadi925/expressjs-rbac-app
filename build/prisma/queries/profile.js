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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PrismaDBProfile_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaDBProfile = void 0;
const client_1 = require("@prisma/client");
class PrismaDBProfile {
    constructor() {
        _PrismaDBProfile_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaDBProfile_prisma, new client_1.PrismaClient(), "f");
    }
    createProfile(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pf = yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.upsert({
                where: { userId },
                update: Object.assign({}, data),
                create: Object.assign(Object.assign({}, data), { user: {
                        connect: {
                            id: userId,
                        },
                    } }),
            });
            return pf;
        });
    }
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.update({
                where: { userId },
                data,
            });
        });
    }
    getProfileWithRole(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.findUnique({
                where: { userId },
                select: {
                    id: true,
                    displayname: true,
                    createdAt: true,
                    updatedAt: true,
                    avatar: true,
                    bio: true,
                    location: true,
                    contact: true,
                    user: {
                        select: {
                            role: true,
                        },
                    },
                },
            });
        });
    }
    setDisplayName(userId, displayname) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.update({
                where: { userId },
                data: { displayname },
            });
        });
    }
    setBio(userId, bio) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.update({
                where: { userId },
                data: { bio },
            });
        });
    }
    setAvatar(userId, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.update({
                where: { userId },
                data: { avatar },
            });
        });
    }
    deleteProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _PrismaDBProfile_prisma, "f").profile.delete({
                where: {
                    id: userId,
                },
            });
        });
    }
}
exports.PrismaDBProfile = PrismaDBProfile;
_PrismaDBProfile_prisma = new WeakMap();
