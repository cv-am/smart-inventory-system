import express from "express";
import {
  getInventory,
  getInventorySummary,
  adjustStock,
} from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getInventory);
router.get("/summary", authMiddleware, getInventorySummary);
router.post("/adjust", authMiddleware, adjustStock);

export default router;

