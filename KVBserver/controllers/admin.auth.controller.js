import { Admin } from "../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateTokenAndSetCookie from "../lib/generateToken.js";

// @desc    Register a new admin
// @route   POST /api/admin-auth/signup
// @access  Public (or protected, depending on business logic)
export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newAdmin) {
      generateTokenAndSetCookie(newAdmin._id, res, "jwt_admin");
      await newAdmin.save();

      res.status(201).json({
        _id: newAdmin._id,
        fullName: newAdmin.fullName,
        email: newAdmin.email,
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    console.log("Error in admin signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Auth admin & get token
// @route   POST /api/admin-auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      generateTokenAndSetCookie(admin._id, res, "jwt_admin");

      res.status(200).json({
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in admin login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Logout admin / clear cookie
// @route   POST /api/admin-auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    res.cookie("jwt_admin", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in admin logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Forgot password
// @route   POST /api/admin-auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) {
    return res.status(404).json({ message: "Admin not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  admin.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  admin.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await admin.save({ validateBeforeSave: false });

  res.status(200).json({
    message:
      "Password reset token generated. In a real app, this would be emailed.",
    resetToken, // For testing purposes only
  });
};

// @desc    Reset password
// @route   PUT /api/admin-auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const admin = await Admin.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!admin) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(req.body.password, salt);
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  res.status(200).json({ message: "Password reset successful" });
};
