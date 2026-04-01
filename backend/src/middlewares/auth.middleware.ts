import { Response, NextFunction } from 'express';
import { container } from '../core/container';
import { TYPES } from '../core/types';
import { IJWTService } from '../interfaces/jwt.service.interface';
import logger from '../utils/logger';

import { RequestWithUser } from '../interfaces/request.interface';

export const authMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const jwtService = container.get<IJWTService>(TYPES.JWTService);
    
    const decoded = jwtService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }

    req.user = decoded as { id: string; email?: string; username?: string };
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Unauthorized access.' });
  }
};

export const optionalAuthMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtService = container.get<IJWTService>(TYPES.JWTService);
      const decoded = jwtService.verifyToken(token);
      if (decoded) {
        req.user = decoded as { id: string; email?: string; username?: string };
      }
    }
    next();
  } catch {
    next();
  }
};
