import { SignupRequestDTO, LoginRequestDTO, OTPVerifyRequestDTO, AuthResponseDTO, ResetPasswordRequestDTO } from '../dtos/auth.dto';

export interface IAuthService {
  signup(signupData: SignupRequestDTO): Promise<void>;
  verifyOTP(verifyData: OTPVerifyRequestDTO): Promise<AuthResponseDTO>;
  login(loginData: LoginRequestDTO): Promise<AuthResponseDTO>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(resetData: ResetPasswordRequestDTO): Promise<void>;
}
