import mongoose from "mongoose";
import logger from "../utils/logger";

export const connectDB = async () => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
        logger.error("No DATABASE_URL set in environment variables.");
        process.exit(1);
    }

    logger.info(`Attempting to connect to database...`);
    await mongoose.connect(dbUrl);
    
    logger.info("🔥 Database connection established successfully!");
  } catch (error) {
    logger.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
