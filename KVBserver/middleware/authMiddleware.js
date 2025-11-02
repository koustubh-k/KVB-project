import jwt from "jsonwebtoken";
import { Admin, Worker } from "../models/index.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_admin;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.userId).select("-password");

    if (!admin) {
      return res.status(401).json({ error: "Unauthorized - Admin Only" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
};

export const protectWorker = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_worker;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const worker = await Worker.findById(decoded.userId).select("-password");

    if (!worker) {
      return res.status(401).json({ error: "Unauthorized - Worker Only" });
    }

    req.worker = worker;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
};
