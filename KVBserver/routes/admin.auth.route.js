import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/admin.auth.controller.js";
import { protectAdmin } from "../middleware/authMiddleware.js";
import {
  validateAdminSignup,
  validateAdminLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateAdminSignup, signup);
router.post("/login", validateAdminLogin, login);
router.post("/logout", protectAdmin, logout);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.put("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
