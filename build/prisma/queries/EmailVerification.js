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
var _EmailVerification_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerification = void 0;
const client_1 = require("@prisma/client");
class EmailVerification {
    constructor() {
        _EmailVerification_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _EmailVerification_prisma, new client_1.PrismaClient(), "f");
    }
    genRandomCode() {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate a random number between 100000 (inclusive) and 999999 (inclusive)
            const randomCode = Math.floor(100000 + Math.random() * 900000);
            return randomCode;
        });
    }
    createEmailVerification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdEmailVerification = yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.create({ data });
            return createdEmailVerification;
        });
    }
    createOrUpdateEmailVerification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // First, try to find an existing email verification record for the user
            const existingRecord = yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.findUnique({
                where: { userId: data.userId },
            });
            if (existingRecord) {
                // If an existing record is found, update it with the new data
                return yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.update({
                    where: { userId: data.userId },
                    data,
                });
            }
            else {
                // If no existing record is found, create a new one
                return yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.create({ data });
            }
        });
    }
    deleteEmailVerification(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.delete({ where: { email, userId } });
        });
    }
    getEmailVerifyById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").emailVerification.findUnique({
                where: {
                    userId,
                },
            });
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").user.findUnique({
                    where: { id: userId },
                });
                return user;
            }
            catch (error) {
                console.error('Error fetching user by ID:', error);
                throw new Error('Failed to fetch user by ID');
            }
        });
    }
    // Function to update the verify status of a user
    updateUserVerifyStatus(userId, verified) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield __classPrivateFieldGet(this, _EmailVerification_prisma, "f").user.update({
                    where: { id: userId },
                    data: { verified },
                });
                return updatedUser;
            }
            catch (error) {
                console.error('Error updating user verify status:', error);
                throw new Error('Failed to update user verify status');
            }
        });
    }
}
exports.EmailVerification = EmailVerification;
_EmailVerification_prisma = new WeakMap();
