export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  UploadRepository: Symbol.for('UploadRepository'),
  
  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  JWTService: Symbol.for('JWTService'),
  MailService: Symbol.for('MailService'),
  UploadService: Symbol.for('UploadService'),
  
  // Controllers
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController'),
  UploadController: Symbol.for('UploadController')
};
