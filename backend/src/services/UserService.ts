import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { IUserService } from '../interfaces/user.service.interface';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { UpdateProfileRequestDTO, ChangePasswordRequestDTO, UserProfileResponseDTO } from '../dtos/user.dto';
import { TYPES } from '../core/types';

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async getProfile(userId: string): Promise<UserProfileResponseDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found.');
    
    return {
      id: (user as any)._id.toString(),
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture || '',
      isVerified: user.isVerified,
      createdAt: (user as any).createdAt
    };
  }

  async updateProfile(userId: string, updateData: UpdateProfileRequestDTO): Promise<UserProfileResponseDTO> {
    if (updateData.email) {
      const existing = await this.userRepository.findByEmail(updateData.email);
      if (existing && (existing as any)._id.toString() !== userId) {
        throw new Error('Email already in use.');
      }
    }

    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) throw new Error('Failed to update profile.');

    return this.getProfile(userId);
  }

  async updateAvatar(userId: string, imageUrl: string): Promise<UserProfileResponseDTO> {
    const updatedUser = await this.userRepository.update(userId, { profilePicture: imageUrl });
    if (!updatedUser) throw new Error('Failed to update avatar.');
    
    return this.getProfile(userId);
  }

  async changePassword(userId: string, passwordData: ChangePasswordRequestDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found.');

    const isMatch = await bcrypt.compare(passwordData.oldPassword, user.password);
    if (!isMatch) throw new Error('Invalid old password.');

    const hashedPassword = await bcrypt.hash(passwordData.newPassword, 12);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}
