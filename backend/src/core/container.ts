import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Interfaces
import { IUserRepository } from '../interfaces/user.repository.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { IJWTService } from '../interfaces/jwt.service.interface';
import { IMailService } from '../interfaces/mail.service.interface';
import { IAuthController } from '../interfaces/auth.controller.interface';

// Implementations
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { JWTService } from '../services/JWTService';
import { MailService } from '../services/MailService';
import { AuthController } from '../controllers/AuthController';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IJWTService>(TYPES.JWTService).to(JWTService).inSingletonScope();
container.bind<IMailService>(TYPES.MailService).to(MailService).inSingletonScope();

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

export { container };
