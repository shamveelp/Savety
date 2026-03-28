import { injectable } from 'inversify';
import User, { IUser } from '../models/user.model';
import { IUserRepository } from '../interfaces/user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
  async create(userData: any): Promise<IUser> {
    return await User.create(userData);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async update(id: string, updateData: any): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }
}
