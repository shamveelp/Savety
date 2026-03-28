import { injectable } from 'inversify';
import jwt from 'jsonwebtoken';
import { IJWTService } from '../interfaces/jwt.service.interface';
import dotenv from 'dotenv';

dotenv.config();

@injectable()
export class JWTService implements IJWTService {
  private secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your_fallback_secret_key';
  }

  generateToken(payload: any): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, this.secret);
  }
}
