import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getMyProfile, updateMyProfile, } from "../controllers/userController.js";

const router = express.Router();

// 🔥 THIS ROUTE MUST EXIST
router.get("/profile", authMiddleware, getMyProfile);
router.put("/profile", authMiddleware, updateMyProfile);
export default router;
