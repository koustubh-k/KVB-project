import express from "express";
import {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/worker.auth.controller.js";
import {
  validateForgotPassword,
  validateResetPassword,
  validateWorkerLogin,
  validateWorkerSignup,
} from "../middleware/validation.js";

const router = express.Router();

router.post("/signup", validateWorkerSignup, signup);
router.post("/login", validateWorkerLogin, login);
router.post("/logout", logout);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.put("/reset-password/:token", validateResetPassword, resetPassword);

export default router;
