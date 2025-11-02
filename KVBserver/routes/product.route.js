import express from "express";
import {
  getProductsPublic,
  getProductsForCustomer,
  getProductByIdForCustomer,
  getProductByIdPublic,
} from "../controllers/product.controller.js";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";

const router = express.Router();

// Public routes
router.get("/public", getProductsPublic);
router.get("/public/:id", getProductByIdPublic);

// Customer-only routes
router.get("/customer", protectCustomer, getProductsForCustomer);
router.get("/customer/:id", protectCustomer, getProductByIdForCustomer);

// Note: Bulk upload moved to admin routes (/api/admin/bulk-import/products)

export default router;
