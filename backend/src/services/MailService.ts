import { injectable } from 'inversify';
import nodemailer from 'nodemailer';
import { IMailService } from '../interfaces/mail.service.interface';
import dotenv from 'dotenv';

dotenv.config();

@injectable()
export class MailService implements IMailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"Savety Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Savety - Verify your account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #44C972;">Welcome to Savety!</h2>
          <p>Thank you for choosing Savety to protect your precious memories. Please use the following One-Time Password (OTP) to verify your account:</p>
          <div style="background: #f9f9fb; padding: 20px; text-align: center; border-radius: 10px;">
            <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 20px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #aaa; font-size: 12px; text-align: center;">&copy; 2026 Savety. Safe home for your photos.</p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
