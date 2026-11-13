import express from "express";
import { getDashboardData } from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDashboardData);

export default router;

