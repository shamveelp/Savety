import mongoose from "mongoose";
import logger from "../utils/logger";
import { ErrorMessages } from "../enums/errorMessages.enum";
import { ConstantMessages } from "../enums/constantMessages.enum";

export const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
        logger.error(ErrorMessages.DB_URL_MISSING);
        process.exit(1);
    }

    logger.info(ConstantMessages.DB_CONNECTING);
    await mongoose.connect(dbUrl);
    
    logger.info(ConstantMessages.DB_CONNECTED);
  } catch (error) {
    logger.error(ErrorMessages.DB_CONNECTION_ERROR, error);
    process.exit(1);
  }
};
