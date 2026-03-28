import { z } from 'zod';

export const SignupSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters.').max(20, 'Username too long.'),
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').regex(/[A-Z]/, 'Password must contain at least one uppercase letter.'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

export const OTPVerifySchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits.'),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type OTPVerifyInput = z.infer<typeof OTPVerifySchema>;
