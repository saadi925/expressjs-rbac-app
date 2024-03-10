"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const profileHandler_1 = require("../handlers/profileHandler");
const authMiddleware_1 = require("../middleware/authMiddleware");
const r = express_1.default.Router();
exports.profileRoutes = r;
r.get('/', authMiddleware_1.authMiddleware, profileHandler_1.getUserProfile);
r.post('/', authMiddleware_1.authMiddleware, profileHandler_1.createProfile);
r.put('/', authMiddleware_1.authMiddleware, profileHandler_1.updateProfileHandler);
