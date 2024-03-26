"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSocketMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../../config/keys");
const authSocketMiddleware = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token || typeof token !== 'string') {
        return next(new Error('No token provided.'));
    }
    jsonwebtoken_1.default.verify(token, keys_1.KEYS.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error verifying JWT:', err);
            return next(new Error('Failed to authenticate token.'));
        }
        const { role, id } = decoded;
        if (!role || !id) {
            return next(new Error('Not authorized.'));
        }
        if (!['LAWYER', 'CLIENT'].includes(role)) {
            return next(new Error('Not authorized.'));
        }
        socket.userId = id;
        socket.userRole = role;
        next();
    });
};
exports.authSocketMiddleware = authSocketMiddleware;
