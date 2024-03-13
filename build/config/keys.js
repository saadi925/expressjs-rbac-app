"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rbacConfig = exports.KEYS = void 0;
const path_1 = __importDefault(require("path"));
exports.KEYS = {
    JWT_SECRET: process.env.JWT_SECRET || 'fA*&%23sha#@#',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8080,
    server: process.env.SERVER || 'https://www.codingstack.site',
    email: process.env.G_EMAIL,
    password: process.env.G_PASSWORD,
};
exports.rbacConfig = {
    model: path_1.default.resolve(__dirname, './rbac_model.conf'),
    policy: path_1.default.resolve(__dirname, './rbac_policy.csv'),
};
