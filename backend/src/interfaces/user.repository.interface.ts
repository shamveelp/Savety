import { IUser } from '../models/user.model';
import { IBaseRepository } from './base.repository.interface';

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
}
