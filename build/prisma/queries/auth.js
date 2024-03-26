"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.setVerified = exports.updateUser = exports.findUserByEmail = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const _1 = require(".");
const createUser = async (credentials) => {
    const { name, email, role, verified } = credentials;
    const salt = await bcrypt_1.default.genSalt(10);
    const secretPassword = await bcrypt_1.default.hash(credentials.password, salt);
    const user = await _1.prisma.user.create({
        data: {
            name,
            email,
            password: secretPassword,
            role,
            verified,
        },
    });
    return user;
};
exports.createUser = createUser;
const findUserByEmail = async (email) => {
    const user = await _1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    return user;
};
exports.findUserByEmail = findUserByEmail;
const updateUser = async (email, data) => {
    const user = await _1.prisma.user.update({
        where: {
            email,
        },
        data,
    });
    return user;
};
exports.updateUser = updateUser;
const setVerified = async (email) => {
    const user = await _1.prisma.user.update({
        where: {
            email,
        },
        data: {
            verified: true,
        },
    });
    return user;
};
exports.setVerified = setVerified;
const getUserById = async (id) => {
    const user = await _1.prisma.user.findUnique({
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
};
exports.getUserById = getUserById;
