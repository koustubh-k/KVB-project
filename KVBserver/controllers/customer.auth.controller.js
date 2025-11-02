import { Customer } from "../models/index.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../lib/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const customer = await Customer.findOne({ email });

    if (customer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newCustomer = new Customer({
      fullName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    if (newCustomer) {
      generateTokenAndSetCookie(newCustomer._id, res, "jwt_customer");
      await newCustomer.save();

      res.status(201).json({
        _id: newCustomer._id,
        fullName: newCustomer.fullName,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address,
        profilePic: newCustomer.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid customer data" });
    }
  } catch (error) {
    console.log("Error in customer signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      customer?.password || ""
    );

    if (!customer || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateTokenAndSetCookie(customer._id, res, "jwt_customer");

    res.status(200).json({
      _id: customer._id,
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      profilePic: customer.profilePic,
    });
  } catch (error) {
    console.log("Error in customer login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt_customer", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in customer logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Request quotation
export const requestQuotation = async (req, res) => {
  try {
    const { productId, details } = req.body;
    const customerId = req.customer._id;

    const { Quotation } = await import("../models/index.js");

    const quotation = new Quotation({
      customerId,
      productId,
      details,
      createdBy: customerId,
      createdByModel: "Customer",
    });

    await quotation.save();

    res.status(201).json({
      message: "Quotation request submitted successfully",
      quotation,
    });
  } catch (error) {
    console.log("Error in requestQuotation controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get customer's quotations
export const getCustomerQuotations = async (req, res) => {
  try {
    const customerId = req.customer._id;

    const { Quotation } = await import("../models/index.js");

    const quotations = await Quotation.find({ customerId })
      .populate("productId", "name")
      .populate("createdBy", "fullName");

    res.status(200).json(quotations);
  } catch (error) {
    console.log("Error in getCustomerQuotations controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
