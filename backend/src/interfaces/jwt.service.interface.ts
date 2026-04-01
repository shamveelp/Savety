export interface IJWTService {
  generateToken(payload: Record<string, unknown>): string;
  verifyToken(token: string): Record<string, unknown>;
}
