import express from "express";
import { getUsers, updateUserRole, deleteUser } from "./controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import roleMiddleware from "../../middleware/roleMiddleware.js";

const router = express.Router();

// Only admin can list, update roles, or delete users
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.put("/:id/role", authMiddleware, roleMiddleware("admin"), updateUserRole);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

export default router;

