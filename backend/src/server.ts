import express from "express";
import cors from "cors";

import "./config/database";

import authRouter from "./routes/authRoutes";
import usersRouter from "./routes/userRoutes";
import customerRouter from "./routes/customerRoutes";
import productRouter from "./routes/productRoutes";
import challanRouter from "./routes/challanRoutes";

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fundsroom ERP Backend is running!",
  });
});

// =====================================================
// AUTH API
// =====================================================

app.use("/api/auth", authRouter);

// =====================================================
// USERS API
// =====================================================

app.use("/api/users", usersRouter);

// =====================================================
// CUSTOMERS API
// =====================================================

app.use("/api/customers", customerRouter);

// =====================================================
// PRODUCTS API
// =====================================================

app.use("/api/products", productRouter);

// =====================================================
// CHALLANS API
// =====================================================

app.use("/api/challans", challanRouter);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Server error:", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err?.message || "Unknown error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});