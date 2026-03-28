import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { TYPES } from '../core/types';
import { SignupSchema, LoginSchema, VerifyOTPSchema } from '../validations/auth.validation';
import logger from '../utils/logger';

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
    } catch (error: any) {
      logger.error('Signup error:', error);
      if (error.errors) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`OTP Verification attempt: ${req.body.email}`);
      const validatedData = VerifyOTPSchema.parse(req.body);
      const result = await this.authService.verifyOTP(validatedData);
      res.status(200).json({ message: 'OTP verified successfully.', ...result });
    } catch (error: any) {
      logger.error('Verify OTP error:', error);
      if (error.errors) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Login attempt: ${req.body.email}`);
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(200).json({ message: 'Login successful.', ...result });
    } catch (error: any) {
      logger.error('Login error:', error);
      if (error.errors) {
        res.status(400).json({ errors: error.errors });
      } else {
        res.status(400).json({ message: error.message });
      }
    }
  }
}
