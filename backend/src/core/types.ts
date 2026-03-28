export const TYPES = {
  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  
  // Services
  AuthService: Symbol.for('AuthService'),
  UserService: Symbol.for('UserService'),
  JWTService: Symbol.for('JWTService'),
  MailService: Symbol.for('MailService'),
  
  // Controllers
  AuthController: Symbol.for('AuthController'),
  UserController: Symbol.for('UserController')
};
