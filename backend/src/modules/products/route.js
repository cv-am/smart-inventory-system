import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Low stock alerts route (placed before /:id to avoid route shadowing)
router.get("/alerts/low-stock", authMiddleware, getLowStockProducts);

// Public / Authenticated read routes
router.get("/", authMiddleware, getProducts);
router.get("/:id", authMiddleware, getProduct);

// Admin & Staff can create and edit products
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);

// Only Admin can delete products
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

export default router;

