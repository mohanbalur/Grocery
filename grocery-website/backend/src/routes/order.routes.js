import express from "express";
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";

import  authMiddleware  from "../middleware/authMiddleware.js";
import  adminMiddleware  from "../middleware/admin.middleware.js"
const router = express.Router();

// USER
router.post("/", authMiddleware, placeOrder);
router.get("/my", authMiddleware, getUserOrders);

// ADMIN
router.get("/", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
