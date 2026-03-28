import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IAuthService } from '../interfaces/auth.service.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { IMailService } from '../interfaces/mail.service.interface';
import { IJWTService } from '../interfaces/jwt.service.interface';
import { SignupRequestDTO, LoginRequestDTO, OTPVerifyRequestDTO, AuthResponseDTO, ResetPasswordRequestDTO } from '../dtos/auth.dto';
import { TYPES } from '../core/types';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MailService) private mailService: IMailService,
    @inject(TYPES.JWTService) private jwtService: IJWTService
  ) {}

  async signup(signupData: SignupRequestDTO): Promise<void> {
    const existingEmail = await this.userRepository.findByEmail(signupData.email);
    if (existingEmail) {
      throw new Error('Email already in use.');
    }

    const existingUsername = await this.userRepository.findByUsername(signupData.username);
    if (existingUsername) {
      throw new Error('Username already taken.');
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 12);
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    await this.userRepository.create({
      username: signupData.username,
      email: signupData.email,
      password: hashedPassword,
      otp,
      otpExpires,
      isVerified: false
    });

    await this.mailService.sendOTP(signupData.email, otp);
  }

  async verifyOTP(verifyData: OTPVerifyRequestDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(verifyData.email);
    
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.otp !== verifyData.otp || !user.otpExpires || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP.');
    }

    const updatedUser = await this.userRepository.update((user as any)._id, { 
      isVerified: true, 
      $unset: { otp: "", otpExpires: "" } 
    });

    if (!updatedUser) throw new Error('Failed to update user verification status.');

    const token = this.jwtService.generateToken({ id: (updatedUser as any)._id, email: updatedUser.email, username: updatedUser.username });

    return {
      id: (updatedUser as any)._id,
      email: updatedUser.email,
      username: updatedUser.username,
      token
    };
  }

  async login(loginData: LoginRequestDTO): Promise<AuthResponseDTO> {
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified. Please check your email.');
    }

    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.jwtService.generateToken({ id: (user as any)._id, email: user.email, username: user.username });

    return {
      id: (user as any)._id,
      email: user.email,
      username: user.username,
      token
    };
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User with this email does not exist.');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await this.userRepository.update((user as any)._id, {
      otp,
      otpExpires
    });

    await this.mailService.sendOTP(email, otp);
  }

  async resetPassword(resetData: ResetPasswordRequestDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(resetData.email);
    if (!user) {
      throw new Error('User not found.');
    }

    if (user.otp !== resetData.otp || !user.otpExpires || user.otpExpires < new Date()) {
      throw new Error('Invalid or expired OTP.');
    }

    const hashedPassword = await bcrypt.hash(resetData.newPassword, 12);

    await this.userRepository.update((user as any)._id, {
      password: hashedPassword,
      $unset: { otp: "", otpExpires: "" }
    });
  }
}
