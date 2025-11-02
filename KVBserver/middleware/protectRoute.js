import jwt from "jsonwebtoken";
import { Admin, Worker, Customer, Sales } from "../models/index.js";

const protectRoute = async (req, res, next) => {
  try {
    // Check for different JWT cookies based on role
    const token =
      req.cookies.jwt ||
      req.cookies.jwt_admin ||
      req.cookies.jwt_worker ||
      req.cookies.jwt_customer ||
      req.cookies.jwt_sales;

    if (!token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    // Determine user model based on role or try to find in all models
    let user;
    let userRole;

    // Try to find user in different models
    user = await Customer.findById(decoded.userId).select("-password");
    if (user) {
      userRole = "customer";
    } else {
      user = await Worker.findById(decoded.userId).select("-password");
      if (user) {
        userRole = "worker";
      } else {
        user = await Admin.findById(decoded.userId).select("-password");
        if (user) {
          userRole = "admin";
        } else {
          user = await Sales.findById(decoded.userId).select("-password");
          if (user) {
            userRole = "sales";
          }
        }
      }
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Add role to user object if not present
    req.user = { ...user.toObject(), role: userRole || user.role };

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { protectRoute };
export default protectRoute;
