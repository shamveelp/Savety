import { SignupRequestDTO, LoginRequestDTO, OTPVerifyRequestDTO, AuthResponseDTO } from '../dtos/auth.dto';

export interface IAuthService {
  signup(signupData: SignupRequestDTO): Promise<void>;
  verifyOTP(verifyData: OTPVerifyRequestDTO): Promise<AuthResponseDTO>;
  login(loginData: LoginRequestDTO): Promise<AuthResponseDTO>;
}
