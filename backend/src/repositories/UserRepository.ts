import { injectable } from 'inversify';
import User, { IUser } from '../models/user.model';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { BaseRepository } from './BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await this.model.findOne({ username });
  }
}
