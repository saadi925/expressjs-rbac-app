"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'fA*&%23sha#@#', {
        expiresIn: '1d',
    });
};
exports.generateToken = generateToken;
function generateVerificationToken(user, code) {
    return jsonwebtoken_1.default.sign({ id: user.id, role: user.role, code }, process.env.JWT_SECRET || 'fA*&%23sha#@#', {
        expiresIn: '10h',
    });
}
exports.generateVerificationToken = generateVerificationToken;
