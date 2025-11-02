import { Worker } from "../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateTokenAndSetCookie from "../lib/generateToken.js";

// @desc    Register a new worker
// @route   POST /api/worker-auth/signup
// @access  Public
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, specialization } = req.body;

    if (!fullName || !email || !password || !specialization) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const worker = await Worker.findOne({ email });
    if (worker) {
      return res.status(400).json({ message: "Worker already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newWorker = new Worker({
      fullName,
      email,
      password: hashedPassword,
      specialization,
    });

    if (newWorker) {
      generateTokenAndSetCookie(newWorker._id, res, "jwt_worker");
      await newWorker.save();

      res.status(201).json({
        _id: newWorker._id,
        fullName: newWorker.fullName,
        email: newWorker.email,
        specialization: newWorker.specialization,
      });
    } else {
      res.status(400).json({ message: "Invalid worker data" });
    }
  } catch (error) {
    console.log("Error in worker signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Auth worker & get token
// @route   POST /api/worker-auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const worker = await Worker.findOne({ email });

    if (worker && (await bcrypt.compare(password, worker.password))) {
      generateTokenAndSetCookie(worker._id, res, "jwt_worker");

      res.status(200).json({
        _id: worker._id,
        fullName: worker.fullName,
        email: worker.email,
        specialization: worker.specialization,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in worker login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Logout worker / clear cookie
// @route   POST /api/worker-auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    res.cookie("jwt_worker", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in worker logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Forgot password
// @route   POST /api/worker-auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const worker = await Worker.findOne({ email: req.body.email });

  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  worker.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  worker.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await worker.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Password reset token sent. In a real app, this would be emailed.",
    resetToken, // For testing purposes only
  });
};

// @desc    Reset password
// @route   PUT /api/worker-auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const worker = await Worker.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!worker) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt(10);
  worker.password = await bcrypt.hash(req.body.password, salt);
  worker.passwordResetToken = undefined;
  worker.passwordResetExpires = undefined;
  await worker.save();

  res.status(200).json({ message: "Password reset successful" });
};
