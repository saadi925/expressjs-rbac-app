"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = require("util");
const keys_1 = require("../../config/keys");
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const readFileAsync = (0, util_1.promisify)(fs_1.default.readFile);
function sendVerificationEmail(email, verificationToken, code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Read the HTML template file
            const htmlTemplate = yield readFileAsync(path_1.default.resolve(__dirname, './verification_email_template.html'), 'utf8');
            // Replace placeholders in the template with actual values
            const replacedHtml = htmlTemplate
                .replace('{{code}}', code.toString())
                .replace('{{verificationToken}}', verificationToken)
                .replace('{{server}}', keys_1.KEYS.server);
            // Create a Nodemailer transporter
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: keys_1.KEYS.email,
                    pass: keys_1.KEYS.password,
                },
            });
            // Compose email options
            const mailOptions = {
                from: keys_1.KEYS.email,
                to: email,
                subject: 'Verify your email',
                html: replacedHtml,
            };
            // Send the email
            const info = yield transporter.sendMail(mailOptions);
            console.log('Verification email sent:', info.response);
        }
        catch (error) {
            console.error('Error sending verification email:', error);
        }
    });
}
exports.sendVerificationEmail = sendVerificationEmail;
