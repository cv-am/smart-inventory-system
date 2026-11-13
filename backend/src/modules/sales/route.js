import express from "express";
import { getSales, getSale } from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getSales);
router.get("/:id", authMiddleware, getSale);

export default router;

