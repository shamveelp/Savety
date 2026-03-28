import { Request, Response } from 'express';

export interface IUploadController {
  create(req: Request, res: Response): Promise<void>;
  list(req: Request, res: Response): Promise<void>;
  details(req: Request, res: Response): Promise<void>;
  remove(req: Request, res: Response): Promise<void>;
}
