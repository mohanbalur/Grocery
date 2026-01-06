import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

import authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/:productId", authMiddleware , addToCart);
router.delete("/:productId", authMiddleware , removeFromCart);

export default router;
