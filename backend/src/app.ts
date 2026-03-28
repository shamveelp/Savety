import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger";
import userRoutes from "./routes/userRoutes";
import { setupUploadRoutes } from "./routes/upload.routes";
import { container } from "./core/container";

// Load environment variables
dotenv.config();

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});


// Dynamic CORS for multiple origins
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:5173"];
app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));


// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "savety-api"
  });
});


// API Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/uploads", setupUploadRoutes(container));

// Basic Welcome Route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Savety API");
});

export default app;
