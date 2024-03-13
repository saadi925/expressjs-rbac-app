"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authHandler_1 = require("./../handlers/authHandler");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
exports.authRoutes = router;
// create user route (sign up)
router.post('/signup', middleware_1.validateUserCred, authHandler_1.signupHandler);
// sign in route
router.post('/signin', middleware_1.validateLoginCredentials, authHandler_1.signinHandler);
router.get('/email_verify', authHandler_1.emailVerificationHandler);
router.put('/email_verify_code', authHandler_1.verifyWithCode);
router.put('/email_verify/resend', authHandler_1.resendConfirmation);
