import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import pool from "./config/db.js";
import notFoundMiddleware from "./middleware/notFoundMiddleware.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// Import Feature Module Routes
import authRoutes from "./modules/auth/route.js";
import userRoutes from "./modules/users/route.js";
import categoryRoutes from "./modules/categories/route.js";
import productRoutes from "./modules/products/route.js";
import inventoryRoutes from "./modules/inventory/route.js";
import customerRoutes from "./modules/customers/route.js";
import billingRoutes from "./modules/billing/route.js";
import salesRoutes from "./modules/sales/route.js";
import dashboardRoutes from "./modules/dashboard/route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Database health check endpoint
app.get("/api/health", async (req, res, next) => {
  try {
    const [result] = await pool.query("SELECT 1 AS result");
    res.status(200).json({
      success: true,
      message: "Server and database are successfully connected",
      database: result[0].result,
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Mount Feature-Based Business Modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root API test message (only when not serving frontend)
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Smart Inventory & Billing Management API is running",
    timestamp: new Date().toISOString(),
  });
});

// Serve frontend static build if present (Unified Single Service Deployment)
const frontendDist = path.resolve(__dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // Catch-all for React client-side routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method === "GET" && !req.originalUrl.startsWith("/api")) {
      return res.sendFile(path.join(frontendDist, "index.html"));
    }
    next();
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      success: true,
      message: "Smart Inventory & Billing API is active. Frontend build not detected in ./frontend/dist.",
    });
  });
}

// Fallback 404 Handler for API routes
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);

export default app;
