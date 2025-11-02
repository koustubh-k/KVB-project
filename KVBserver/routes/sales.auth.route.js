import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/sales.auth.controller.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Protected routes
router.post("/logout", logout);

export default router;
