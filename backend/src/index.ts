import app from "./app";
import { connectDB } from "./config/db";
import logger from "./utils/logger";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    // Database connection
    await connectDB();
    
    // Start listening
    app.listen(PORT, () => {
      logger.info(`🚀 Savety API running at http://localhost:${PORT}`);
      logger.info(`Health Check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

