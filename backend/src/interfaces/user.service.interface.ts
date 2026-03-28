import { UpdateProfileRequestDTO, ChangePasswordRequestDTO, UserProfileResponseDTO } from '../dtos/user.dto';

export interface IUserService {
  getProfile(userId: string): Promise<UserProfileResponseDTO>;
  updateProfile(userId: string, updateData: UpdateProfileRequestDTO): Promise<UserProfileResponseDTO>;
  updateAvatar(userId: string, imageUrl: string): Promise<UserProfileResponseDTO>;
  changePassword(userId: string, passwordData: ChangePasswordRequestDTO): Promise<void>;
}
