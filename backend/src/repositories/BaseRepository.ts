import { injectable, unmanaged } from 'inversify';
import { Model, Document, UpdateQuery } from 'mongoose';
import { IBaseRepository } from '../interfaces/base.repository.interface';

@injectable()
export abstract class BaseRepository<T extends Document> implements IBaseRepository<T> {
  protected model: Model<T>;

  constructor(@unmanaged() model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: any): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async findAll(filter: any = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async update(id: string, data: UpdateQuery<T> | Partial<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
