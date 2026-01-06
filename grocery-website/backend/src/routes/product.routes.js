import express from "express";
import upload from "../middleware/upload.middleware.js";

import {
  createProduct,
  updateProduct,
  getProducts,
  deleteProduct,
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();

// USER: get products (unchanged)
router.get("/", getProducts);

// ADMIN: create product (image optional)
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createProduct
);

// ADMIN: update product (image optional)
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateProduct
);

// ADMIN: delete product (unchanged)
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;
