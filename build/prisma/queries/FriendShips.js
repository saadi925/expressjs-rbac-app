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
var _PrismaFriendship_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaFriendship = void 0;
const client_1 = require("@prisma/client");
class PrismaFriendship {
    constructor() {
        _PrismaFriendship_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _PrismaFriendship_prisma, new client_1.PrismaClient(), "f");
    }
    addFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendship_prisma, "f").friendship.create({
                    data: {
                        userId: userId,
                        friendId: friendId,
                    },
                });
            }
            catch (error) {
                console.error('Error adding friend:', error);
                throw new Error('Failed to add friend');
            }
        });
    }
    removeFriend(userId, friendId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield __classPrivateFieldGet(this, _PrismaFriendship_prisma, "f").friendship.deleteMany({
                    where: {
                        OR: [
                            { userId: userId, friendId: friendId },
                            { userId: friendId, friendId: userId },
                        ],
                    },
                });
            }
            catch (error) {
                console.error('Error removing friend:', error);
                throw new Error('Failed to remove friend');
            }
        });
    }
    getFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const friends = yield __classPrivateFieldGet(this, _PrismaFriendship_prisma, "f").friendship.findMany({
                    where: { userId },
                });
                return friends;
            }
            catch (error) {
                console.error('Error fetching friends:', error);
                throw new Error('Failed to fetch friends');
            }
        });
    }
}
exports.PrismaFriendship = PrismaFriendship;
_PrismaFriendship_prisma = new WeakMap();
