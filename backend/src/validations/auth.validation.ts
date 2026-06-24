import { z } from 'zod';
import { ErrorMessages } from '../enums/errorMessages.enum';

export const SignupSchema = z.object({
  username: z.string().min(3, ErrorMessages.USERNAME_MIN_LENGTH).max(20, ErrorMessages.USERNAME_MAX_LENGTH),
  email: z.string().email(ErrorMessages.INVALID_EMAIL),
  password: z.string().min(8, ErrorMessages.PASSWORD_MIN_LENGTH).regex(/[A-Z]/, ErrorMessages.PASSWORD_UPPERCASE),
});

export const LoginSchema = z.object({
  email: z.string().email(ErrorMessages.INVALID_EMAIL),
  password: z.string().min(1, ErrorMessages.PASSWORD_REQUIRED),
});

export const VerifyOTPSchema = z.object({
  email: z.string().email(ErrorMessages.INVALID_EMAIL),
  otp: z.string().length(6, ErrorMessages.OTP_LENGTH),
});
