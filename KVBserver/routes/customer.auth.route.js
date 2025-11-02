import express from "express";
import {
  signup,
  login,
  logout,
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

// Note: Quotation routes are handled in customer.route.js
// This file only handles authentication routes

export default router;
