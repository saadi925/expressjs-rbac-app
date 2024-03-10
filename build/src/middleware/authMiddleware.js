"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../../config/keys");
const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    // split the token string with Bearer and the token itself
    const tokenParts = token.split(' ');
    const tokenString = tokenParts[1];
    const tokenType = tokenParts[0];
    if (tokenType !== 'Bearer') {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    jsonwebtoken_1.default.verify(tokenString, keys_1.KEYS.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('err in authMiddleware: ', err);
            return res
                .status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        const { role, id } = decoded;
        if (!role || !id) {
            return res.status(401).send({ auth: false, message: 'Not authorized.' });
        }
        if (!['LAWYER', 'CLIENT'].includes(role)) {
            return res.status(401).send({ auth: false, message: 'Not authorized.' });
        }
        req.userId = id;
        req.userRole = role;
        next();
    });
};
exports.authMiddleware = authMiddleware;
