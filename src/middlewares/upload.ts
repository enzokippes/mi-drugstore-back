import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary';

let storage: multer.StorageEngine;

if (isCloudinaryConfigured) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req: Request, file: Express.Multer.File) => {
      const prefix = req.baseUrl.includes('promotions') ? 'promo' : 'product';
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      return {
        folder: 'barbanegra-drugstore',
        public_id: `${prefix}-${uniqueSuffix}`,
      };
    },
  }) as unknown as multer.StorageEngine;
} else {
  storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const prefix = req.baseUrl.includes('promotions') ? 'promo' : 'product';
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });
}

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (JPEG, PNG, WebP, GIF)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
