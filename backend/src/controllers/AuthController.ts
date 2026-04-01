import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { TYPES } from '../core/types';
import { SignupSchema, LoginSchema, VerifyOTPSchema } from '../validations/auth.validation';
import logger from '../utils/logger';
import { ZodError } from 'zod';

@injectable()
export class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private authService: IAuthService
  ) {}

  async signup(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Signup attempt: ${req.body.email}`);
      const validatedData = SignupSchema.parse(req.body);
      await this.authService.signup(validatedData);
      res.status(201).json({ message: 'Signup successful. Please check your email for verification OTP.' });
    } catch (error) {
      logger.error('Signup error:', error);
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(400).json({ message: err.message });
      }
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`OTP Verification attempt: ${req.body.email}`);
      const validatedData = VerifyOTPSchema.parse(req.body);
      const result = await this.authService.verifyOTP(validatedData);
      res.status(200).json({ message: 'OTP verified successfully.', ...result });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(400).json({ message: err.message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Login attempt: ${req.body.email}`);
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(200).json({ message: 'Login successful.', ...result });
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(400).json({ message: err.message });
      }
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.status(200).json({ message: 'Reset password OTP sent to your email.' });
    } catch (error) {
      logger.error('Forgot password error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.resetPassword(req.body);
      res.status(200).json({ message: 'Password reset successful. You can now login.' });
    } catch (error) {
      logger.error('Reset password error:', error);
      const err = error as Error;
      res.status(400).json({ message: err.message });
    }
  }
}
