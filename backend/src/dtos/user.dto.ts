export interface UpdateProfileRequestDTO {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequestDTO {
  oldPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UserProfileResponseDTO {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  isVerified: boolean;
  createdAt: Date;
}
