export interface SignupRequestDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface OTPVerifyRequestDTO {
  email: string;
  otp: string;
}

export interface AuthResponseDTO {
  id: string;
  email: string;
  username: string;
  token?: string;
}
export interface ResetPasswordRequestDTO {
  email: string;
  otp: string;
  newPassword: string;
}
