import { Request, Response } from 'express';

export interface IUploadController {
  create(req: Request, res: Response): Promise<void>;
  list(req: Request, res: Response): Promise<void>;
  details(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  remove(req: Request, res: Response): Promise<void>;
  explore(req: Request, res: Response): Promise<void>;
  toggleLike(req: Request, res: Response): Promise<void>;
  publicProfile(req: Request, res: Response): Promise<void>;
}
