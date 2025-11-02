import express from "express";
import {
  getProductsPublic,
  getProductsForCustomer,
  getProductByIdForCustomer,
  getProductByIdPublic,
  uploadProductsExcel,
} from "../controllers/product.controller.js";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { authorizeRole } from "../middleware/roleMiddleware.js";
import singleUpload from "../middleware/multer.js";

const router = express.Router();

// Public routes
router.get("/public", getProductsPublic);
router.get("/public/:id", getProductByIdPublic);

// Customer-only routes
router.get("/customer", protectCustomer, getProductsForCustomer);
router.get("/customer/:id", protectCustomer, getProductByIdForCustomer);

// Admin bulk upload
router.post(
  "/upload-excel",
  protectRoute,
  authorizeRole("admin"),
  singleUpload,
  uploadProductsExcel
);

export default router;
