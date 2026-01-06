import express from "express";
import {
  createCategory,
  getCategories,
} from "../controllers/category.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import  adminMiddleware  from "../middleware/admin.middleware.js"

const router = express.Router();

router.post("/", authMiddleware, adminMiddleware, createCategory);
router.get("/", getCategories);

export default router;
