import jwt from "jsonwebtoken";
import { Customer } from "../models/index.js";

export const protectCustomer = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_customer;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const customer = await Customer.findById(decoded.userId).select(
      "-password"
    );

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    req.customer = customer;

    next();
  } catch (error) {
    console.log("Error in protectCustomer middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
