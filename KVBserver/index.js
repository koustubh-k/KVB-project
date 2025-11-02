import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import taskRouter from "./routes/task.route.js";
import customerAuthRouter from "./routes/customer.auth.route.js";
import customerRouter from "./routes/customer.route.js";
import productRouter from "./routes/product.route.js";
import workerAuthRouter from "./routes/worker.auth.route.js";
import adminAuthRouter from "./routes/admin.auth.route.js";
import adminRouter from "./routes/admin.route.js";
import salesAuthRouter from "./routes/sales.auth.route.js";
import salesRouter from "./routes/sales.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Serve static files from images directory
app.use("/images", express.static("./images"));

app.use("/api/admin-auth", adminAuthRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/customer-auth", customerAuthRouter);
app.use("/api/customer", customerRouter);
app.use("/api/products", productRouter);
app.use("/api/worker-auth", workerAuthRouter);
app.use("/api/sales-auth", salesAuthRouter);
app.use("/api/sales", salesRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "KVB CRM Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Success Home Page",
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connectDB();
  console.log(`server running on http://localhost:${PORT}`);
});
