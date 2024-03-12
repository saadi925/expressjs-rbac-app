import fs from 'fs';
import { promisify } from 'util';
import { KEYS } from '../../config/keys';
import nodemailer from 'nodemailer';
import path from 'path';

const readFileAsync = promisify(fs.readFile);

async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  code: number,
) {
  try {
    // Read the HTML template file
    const htmlTemplate = await readFileAsync(
      path.resolve(__dirname, './verification_email_template.html'),
      'utf8',
    );

    // Replace placeholders in the template with actual values
    const replacedHtml = htmlTemplate
      .replace('{{code}}', code.toString())
      .replace('{{verificationToken}}', verificationToken)
      .replace('{{server}}', KEYS.server);

    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: KEYS.email,
        pass: KEYS.password,
      },
    });

    // Compose email options
    const mailOptions = {
      from: KEYS.email,
      to: email,
      subject: 'Verify your email',
      html: replacedHtml,
    };
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Verification email sent:', info.response);
    } catch (error) {
      console.log('error while sending email : ', error);
    }
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
}

export { sendVerificationEmail };
