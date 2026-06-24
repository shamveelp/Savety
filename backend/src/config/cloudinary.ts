import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import logger from '../utils/logger';
import { ConstantMessages } from '../enums/constantMessages.enum';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

logger.info(`${ConstantMessages.CLOUDINARY_CONFIGURED} ${process.env.CLOUDINARY_CLOUD_NAME}`);

export default cloudinary;
