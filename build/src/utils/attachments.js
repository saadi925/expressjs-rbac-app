"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid"); // For
const path_1 = __importDefault(require("path"));
// Multer configuration for handling file uploads
exports.storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueFileName = `${(0, uuid_1.v4)()}${path_1.default.extname(file.originalname)}`; // Generate unique filename
        cb(null, uniqueFileName);
    },
});
exports.upload = (0, multer_1.default)({ storage: exports.storage });
