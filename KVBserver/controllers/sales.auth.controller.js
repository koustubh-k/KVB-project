import { Sales } from "../models/index.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateTokenAndSetCookie from "../lib/generateToken.js";

// @desc    Register a new sales user
// @route   POST /api/sales-auth/signup
// @access  Public (Admin only in production)
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, region } = req.body;

    if (!fullName || !email || !password || !region) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const salesUser = await Sales.findOne({ email });
    if (salesUser) {
      return res.status(400).json({ message: "Sales user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newSalesUser = new Sales({
      fullName,
      email,
      password: hashedPassword,
      region,
    });

    if (newSalesUser) {
      generateTokenAndSetCookie(newSalesUser._id, res, "jwt_sales");
      await newSalesUser.save();

      res.status(201).json({
        _id: newSalesUser._id,
        fullName: newSalesUser.fullName,
        email: newSalesUser.email,
        region: newSalesUser.region,
      });
    } else {
      res.status(400).json({ message: "Invalid sales user data" });
    }
  } catch (error) {
    console.log("Error in sales signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Auth sales user & get token
// @route   POST /api/sales-auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const salesUser = await Sales.findOne({ email });

    if (salesUser && (await bcrypt.compare(password, salesUser.password))) {
      generateTokenAndSetCookie(salesUser._id, res, "jwt_sales");

      res.status(200).json({
        _id: salesUser._id,
        fullName: salesUser.fullName,
        email: salesUser.email,
        region: salesUser.region,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log("Error in sales login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Logout sales user / clear cookie
// @route   POST /api/sales-auth/logout
// @access  Private
export const logout = (req, res) => {
  try {
    res.cookie("jwt_sales", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in sales logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Forgot password
// @route   POST /api/sales-auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const salesUser = await Sales.findOne({ email: req.body.email });

  if (!salesUser) {
    return res.status(404).json({ message: "Sales user not found" });
  }

  const resetToken = crypto.randomBytes(20).toString("hex");

  salesUser.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  salesUser.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  await salesUser.save({ validateBeforeSave: false });

  res.status(200).json({
    message: "Password reset token sent. In a real app, this would be emailed.",
    resetToken, // For testing purposes only
  });
};

// @desc    Reset password
// @route   PUT /api/sales-auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const salesUser = await Sales.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!salesUser) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const salt = await bcrypt.genSalt(10);
  salesUser.password = await bcrypt.hash(req.body.password, salt);
  salesUser.passwordResetToken = undefined;
  salesUser.passwordResetExpires = undefined;
  await salesUser.save();

  res.status(200).json({ message: "Password reset successful" });
};
