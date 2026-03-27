import dotenv from "dotenv";
import logger from "../utils/logger";

dotenv.config();

export const connectDB = async () => {
  try {
    // This is a placeholder for your DB connection.
    // Replace with your DB driver's connection logic (e.g., Mongoose, Sequelize, or PG-Client)
    
    const dbUrl = process.env.DATABASE_URL || "null";
    
    if (dbUrl === "null") {
        logger.warn("No DATABASE_URL set. Running in development mode without DB persistence.");
        return;
    }

    logger.info(`Connecting to database at: ${dbUrl}`);
    // await mongoose.connect(dbUrl); // Example for Mongoose
    
    logger.info("🔥 Database connection established successfully!");
  } catch (error) {
    logger.error("❌ Database connection error:", error);
    process.exit(1);
  }
};

