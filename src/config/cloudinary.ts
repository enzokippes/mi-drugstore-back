import { v2 as cloudinary } from 'cloudinary';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
}

export default cloudinary;
export const isCloudinaryConfigured = !!process.env.CLOUDINARY_URL;
