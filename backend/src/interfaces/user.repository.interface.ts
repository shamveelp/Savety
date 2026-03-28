import { IUser } from '../models/user.model';

export interface IUserRepository {
  create(userData: any): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  update(id: string, updateData: any): Promise<IUser | null>;
}
