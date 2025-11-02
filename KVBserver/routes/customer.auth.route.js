import express from "express";
import {
  signup,
  login,
  logout,
  requestQuotation,
  getCustomerQuotations,
} from "../controllers/customer.auth.controller.js";
import { protectCustomer } from "../middleware/customerAuthMiddleware.js";
import {
  validateCustomerLogin,
  validateCustomerSignup,
} from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateCustomerSignup, signup);
router.post("/login", validateCustomerLogin, login);
router.post("/logout", logout);

// Quotation routes
router.post("/quotation", protectCustomer, requestQuotation);
router.get("/quotations", protectCustomer, getCustomerQuotations);

export default router;
