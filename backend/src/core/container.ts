import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Interfaces
import { IUserRepository } from '../interfaces/user.repository.interface';
import { IAuthService } from '../interfaces/auth.service.interface';
import { IUserService } from '../interfaces/user.service.interface';
import { IJWTService } from '../interfaces/jwt.service.interface';
import { IMailService } from '../interfaces/mail.service.interface';
import { IAuthController } from '../interfaces/auth.controller.interface';
import { IUserController } from '../interfaces/user.controller.interface';
import { IUploadRepository } from '../interfaces/upload.repository.interface';
import { IUploadService } from '../interfaces/upload.service.interface';
import { IUploadController } from '../interfaces/upload.controller.interface';

// Implementations
import { UserRepository } from '../repositories/UserRepository';
import { AuthService } from '../services/AuthService';
import { UserService } from '../services/UserService';
import { JWTService } from '../services/JWTService';
import { MailService } from '../services/MailService';
import { AuthController } from '../controllers/AuthController';
import { UserController } from '../controllers/UserController';
import { UploadRepository } from '../repositories/UploadRepository';
import { UploadService } from '../services/UploadService';
import { UploadController } from '../controllers/UploadController';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
container.bind<IUploadRepository>(TYPES.UploadRepository).to(UploadRepository).inSingletonScope();

// Services
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<IJWTService>(TYPES.JWTService).to(JWTService).inSingletonScope();
container.bind<IMailService>(TYPES.MailService).to(MailService).inSingletonScope();
container.bind<IUploadService>(TYPES.UploadService).to(UploadService).inSingletonScope();

// Controllers
container.bind<IAuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
container.bind<IUserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<IUploadController>(TYPES.UploadController).to(UploadController).inSingletonScope();

export { container };
