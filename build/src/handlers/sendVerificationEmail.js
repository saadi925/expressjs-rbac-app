"use strict";
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
async function sendVerificationEmail(email, verificationToken, code) {
    try {
        // Read the HTML template file
        const htmlTemplate = await readFileAsync(path_1.default.resolve(__dirname, './verification_email_template.html'), 'utf8');
        // Replace placeholders in the template with actual values
        const replacedHtml = htmlTemplate
            .replace('{{code}}', code.toString())
            .replace('{{verificationToken}}', verificationToken)
            .replace('{{server}}', keys_1.KEYS.server);
        console.log(verificationToken);
        if (!keys_1.KEYS.email || !keys_1.KEYS.password) {
            throw new Error('sender email error , please try again later');
        }
        // Create a Nodemailer transporter
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 465,
            secure: true,
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
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Verification email sent:', info.response);
        }
        catch (error) {
            console.log('error while sending email : ', error);
        }
    }
    catch (error) {
        console.error('Error sending verification email:', error);
    }
}
exports.sendVerificationEmail = sendVerificationEmail;
