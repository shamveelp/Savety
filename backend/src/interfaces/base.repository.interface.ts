import { Document, UpdateQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(filter: any): Promise<T | null>;
  findAll(filter?: any): Promise<T[]>;
  update(id: string, data: UpdateQuery<T> | Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
