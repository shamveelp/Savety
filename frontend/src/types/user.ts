export interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
}

export interface UserAuthResponse {
  message: string;
  token?: string;
  id?: string;
  username?: string;
  email?: string;
}

export interface UpdateProfileInput {
  username?: string;
  email?: string;
}

export interface ChangePasswordInput {
  oldPassword?: string;
  newPassword?: string;
}

export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword?: string;
}
