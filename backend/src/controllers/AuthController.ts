import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { TYPES } from '../core/types';
import { SignupSchema, LoginSchema, VerifyOTPSchema } from '../validations/auth.validation';
import logger from '../utils/logger';
import { ZodError } from 'zod';
import { StatusCodes } from '../enums/statusCodes.enum';
import { ConstantMessages } from '../enums/constantMessages.enum';

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
      res.status(StatusCodes.CREATED).json({ message: ConstantMessages.SIGNUP_SUCCESS });
    } catch (error) {
      logger.error('Signup error:', error);
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`OTP Verification attempt: ${req.body.email}`);
      const validatedData = VerifyOTPSchema.parse(req.body);
      const result = await this.authService.verifyOTP(validatedData);
      res.status(StatusCodes.OK).json({ message: ConstantMessages.OTP_VERIFIED, ...result });
    } catch (error) {
      logger.error('Verify OTP error:', error);
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Login attempt: ${req.body.email}`);
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.authService.login(validatedData);
      res.status(StatusCodes.OK).json({ message: ConstantMessages.LOGIN_SUCCESS, ...result });
    } catch (error) {
      logger.error('Login error:', error);
      if (error instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.issues });
      } else {
        const err = error as Error;
        res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
      }
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      res.status(StatusCodes.OK).json({ message: ConstantMessages.RESET_OTP_SENT });
    } catch (error) {
      logger.error('Forgot password error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      await this.authService.resetPassword(req.body);
      res.status(StatusCodes.OK).json({ message: ConstantMessages.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      logger.error('Reset password error:', error);
      const err = error as Error;
      res.status(StatusCodes.BAD_REQUEST).json({ message: err.message });
    }
  }
}
