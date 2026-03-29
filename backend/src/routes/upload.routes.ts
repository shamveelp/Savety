import { Router } from 'express';
import { Container } from 'inversify';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { TYPES } from '../core/types';
import { authMiddleware, optionalAuthMiddleware } from '../middlewares/auth.middleware';
import { upload as multerUpload } from '../middlewares/upload.middleware';

export const setupUploadRoutes = (container: Container): Router => {
  const router = Router();
  const uploadController = container.get<IUploadController>(TYPES.UploadController);

  // Protected: Bulk Upload
  router.post('/', authMiddleware, multerUpload.array('images', 20), (req, res) => uploadController.create(req, res));

  // Protected: List user uploads
  router.get('/', authMiddleware, (req, res) => uploadController.list(req, res));

  // Public/Protected: Details of a specific upload (internally handled visibility)
  router.get('/:id', optionalAuthMiddleware, (req, res) => uploadController.details(req, res));

  // Protected: Update upload (edit metadata/images)
  router.put('/:id', authMiddleware, multerUpload.array('images', 20), (req, res) => uploadController.update(req, res));

  // Protected: Remove upload
  router.delete('/:id', authMiddleware, (req, res) => uploadController.remove(req, res));

  return router;
};
