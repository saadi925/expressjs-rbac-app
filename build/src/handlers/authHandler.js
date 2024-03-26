"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationHandler = exports.verifyWithCode = exports.resendConfirmation = exports.signinHandler = exports.signupHandler = void 0;
const express_validator_1 = require("express-validator");
const prisma_1 = require("../../prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const generateToken_1 = require("../utils/generateToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const keys_1 = require("../../config/keys");
const sendVerificationEmail_1 = require("./sendVerificationEmail");
const EmailVerification_1 = require("../../prisma/queries/EmailVerification");
const AccountNotifications_1 = require("../../notifications/AccountNotifications");
const signupHandler = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await (0, prisma_1.findUserByEmail)(email);
        if (user) {
            if (!user.verified) {
                res.status(401).json({
                    errors: [{ msg: 'verify your email to get logged in' }],
                    redirectToVerify: true,
                });
                return;
            }
            else {
                return res.status(400).json({
                    errors: [{ msg: 'User already exists' }],
                    redirectToLogin: true,
                });
            }
        }
        const data = {
            name,
            email,
            password,
            role,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            verified: false,
        };
        const newUser = await (0, prisma_1.createUser)(data);
        const emailVerification = new EmailVerification_1.EmailVerification();
        const code = await emailVerification.genRandomCode();
        const verificationToken = (0, generateToken_1.generateVerificationToken)(newUser, code);
        await emailVerification.createEmailVerification({
            email,
            verificationToken,
            code,
            userId: newUser.id,
        });
        console.log('code', code);
        await (0, sendVerificationEmail_1.sendVerificationEmail)(email, verificationToken, code);
        res.status(201).json({
            message: 'user has been registered successfully , verify email to get logged in',
            redirectToVerify: true,
        });
    }
    catch (error) {
        console.error('Error in signupHandler:', error);
        return res.status(500).json({
            errors: [
                {
                    msg: 'Internal Server Error',
                },
            ],
        });
    }
};
exports.signupHandler = signupHandler;
const signinHandler = async (req, res) => {
    try {
        let success = false;
        const { email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array(), success });
        }
        const user = await (0, prisma_1.findUserByEmail)(email);
        if (!user) {
            // if user is not found .
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }], success });
        }
        const passwordCompare = await bcrypt_1.default.compare(password, user.password);
        if (!passwordCompare) {
            //  incase , if password is incorrect
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }], success });
        }
        if (!user.verified) {
            return res.status(401).json({
                errors: [{ msg: 'Sorry ! User is Not Verified, Please Verify first!' }],
                success,
                email,
            });
        }
        success = true;
        const token = (0, generateToken_1.generateToken)(user);
        const profileDB = new prisma_1.PrismaDBProfile();
        const profile = await profileDB.getProfileWithRole(user.id);
        if (!profile) {
            res.status(201).json({
                token,
                success,
                errors: [
                    {
                        msg: 'create your profile to get started',
                    },
                ],
                redirectToProfile: true,
            });
        }
        else {
            res.status(201).json({ token, success });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
exports.signinHandler = signinHandler;
const resendConfirmation = async (req, res) => {
    try {
        const { email } = req.body;
        // Check if the user exists
        const user = await (0, prisma_1.findUserByEmail)(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if the user is already verified
        if (user.verified) {
            return res.status(400).json({ error: 'User is already verified' });
        }
        const emailVerification = new EmailVerification_1.EmailVerification();
        // Generate a new verification code
        const code = await emailVerification.genRandomCode();
        const verificationToken = (0, generateToken_1.generateVerificationToken)(user, code);
        // Create a new email verification record or update the existing one
        await emailVerification.createOrUpdateEmailVerification({
            email,
            userId: user.id,
            code,
            verificationToken,
        });
        await (0, sendVerificationEmail_1.sendVerificationEmail)(email, verificationToken, code);
        return res
            .status(200)
            .json({ message: `Confirmation email sent successfully to ${email}` });
    }
    catch (error) {
        console.error('Error resending confirmation email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.resendConfirmation = resendConfirmation;
const verifyWithCode = async (req, res) => {
    const email = req.query.email;
    const code = req.query.code;
    if (!email ||
        !code ||
        typeof email !== 'string' ||
        typeof code !== 'string') {
        res.status(403).json({ error: 'email or code is missing' });
        return;
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        res.status(403).json({ error: 'user not found ' });
        return;
    }
    if (user.verified) {
        res.status(403).json({ error: 'email already verified, you can login' });
    }
    const emailVerify = new EmailVerification_1.EmailVerification();
    const emailRecord = await emailVerify.getEmailVerifyById(user.id);
    if (!emailRecord) {
        res.status(403).json({
            error: 'no email exists',
        });
        return;
    }
    if (emailRecord.email !== email) {
        res.status(403).json({ error: 'invalid email' });
    }
    const verify = verifyCodeForEmailVerify(emailRecord, Number(code));
    if (!verify) {
        res.status(403).json({ error: 'invalid code' });
    }
    else {
        const token = (0, generateToken_1.generateVerificationToken)(user, Number(code));
        //  user verified .
        const role = user.role;
        res.status(200).json({ token, role, redirectToProfile: true });
    }
};
exports.verifyWithCode = verifyWithCode;
const verifyCodeForEmailVerify = (emailRecord, code) => {
    if (emailRecord.code !== code) {
        return false;
    }
    else {
        return true;
    }
};
const emailVerificationHandler = async (req, res) => {
    try {
        const one_time_token = req.query.one_time_token;
        if (!one_time_token || typeof one_time_token !== 'string') {
            return res.status(400).json({ error: 'Missing verification token' });
        }
        const decodedToken = jsonwebtoken_1.default.verify(one_time_token, keys_1.KEYS.JWT_SECRET);
        const { id, code } = decodedToken;
        // Validate if the decoded token contains the necessary information
        if (!id || !code) {
            return res.status(400).json({ error: 'Invalid verification token' });
        }
        // Check if the verification code matches the one stored in the database
        const emailVerification = new EmailVerification_1.EmailVerification();
        const email = await emailVerification.getEmailVerifyById(id);
        if (!email) {
            return res
                .status(404)
                .json({ error: 'Email verification record not found' });
        }
        if (email.code !== code) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        // Update the user's verified status in the database
        await emailVerification.updateUserVerifyStatus(email.userId, true);
        const notifier = new AccountNotifications_1.AccountNotifications();
        await notifier.emailVerifyNotification(email.email, email.userId);
        // Delete the email verification record from the database
        await emailVerification.deleteEmailVerification(email.email, id);
        return res.status(200).json({ message: 'Email verification successful' });
    }
    catch (error) {
        console.error('Error in emailVerificationHandler:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.emailVerificationHandler = emailVerificationHandler;
