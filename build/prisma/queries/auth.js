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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.setVerified = exports.updateUser = exports.findUserByEmail = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const _1 = require(".");
const createUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, role, verified } = credentials;
    const salt = yield bcrypt_1.default.genSalt(10);
    const secretPassword = yield bcrypt_1.default.hash(credentials.password, salt);
    const user = yield _1.prisma.user.create({
        data: {
            name,
            email,
            password: secretPassword,
            role,
            verified,
        },
    });
    return user;
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
});
exports.findUserByEmail = findUserByEmail;
const updateUser = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.prisma.user.update({
        where: {
            email,
        },
        data,
    });
    return user;
});
exports.updateUser = updateUser;
const setVerified = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.prisma.user.update({
        where: {
            email,
        },
        data: {
            verified: true,
        },
    });
    return user;
});
exports.setVerified = setVerified;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield _1.prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            verified: true,
        },
    });
    return user;
});
exports.getUserById = getUserById;
