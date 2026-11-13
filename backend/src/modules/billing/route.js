import express from "express";
import { createBill } from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

// Protected: only authenticated staff or admin can create bills
router.post("/", authMiddleware, createBill);

export default router;

