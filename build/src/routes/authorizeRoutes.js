"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeApi = void 0;
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../../src/handlers/authorization");
const authMiddleware_1 = require("../../src/middleware/authMiddleware");
const router = express_1.default.Router();
exports.authorizeApi = router;
router.get('/', authMiddleware_1.authMiddleware, authorization_1.authorizeAction);
