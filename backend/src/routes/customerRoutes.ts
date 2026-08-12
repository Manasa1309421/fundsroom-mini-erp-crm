import { Router } from "express";
import { pool } from "../config/database";
import { authenticateToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// ===============================
// TEST CUSTOMER DATABASE
// ===============================
router.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Customers database is working!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Customer DB test error:", error);

    res.status(500).json({
      success: false,
      message: "Customer database connection failed",
    });
  }
});

// ===============================
// AUTHENTICATION REQUIRED
// ===============================
router.use(authenticateToken);

// ===============================
// CREATE CUSTOMER
// ADMIN + SALES
// ===============================
router.post(
  "/",
  authorizeRoles("ADMIN", "SALES"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
      } = req.body;

      if (!name || !email) {
        return res.status(400).json({
          success: false,
          message: "Name and email are required",
        });
      }

      const result = await pool.query(
        `INSERT INTO customers
         (name, email, phone, address)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          name,
          email,
          phone || null,
          address || null,
        ]
      );

      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        customer: result.rows[0],
      });

    } catch (error: any) {
      console.error("Create customer error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to create customer",
        error: error.message,
      });
    }
  }
);

// ===============================
// GET ALL CUSTOMERS
// ADMIN + SALES + ACCOUNTS
// ===============================
router.get(
  "/",
  authorizeRoles("ADMIN", "SALES", "ACCOUNTS"),
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT *
         FROM customers
         ORDER BY id DESC`
      );

      res.json({
        success: true,
        customers: result.rows,
      });

    } catch (error: any) {
      console.error("Get customers error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to get customers",
        error: error.message,
      });
    }
  }
);

// ===============================
// GET CUSTOMER BY ID
// ADMIN + SALES + ACCOUNTS
// ===============================
router.get(
  "/:id",
  authorizeRoles("ADMIN", "SALES", "ACCOUNTS"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `SELECT *
         FROM customers
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.json({
        success: true,
        customer: result.rows[0],
      });

    } catch (error: any) {
      console.error("Get customer error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to get customer",
        error: error.message,
      });
    }
  }
);

// ===============================
// UPDATE CUSTOMER
// ADMIN + SALES
// ===============================
router.put(
  "/:id",
  authorizeRoles("ADMIN", "SALES"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        name,
        email,
        phone,
        address,
      } = req.body;

      const result = await pool.query(
        `UPDATE customers
         SET
           name = COALESCE($1, name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           address = COALESCE($4, address)
         WHERE id = $5
         RETURNING *`,
        [
          name,
          email,
          phone,
          address,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.json({
        success: true,
        message: "Customer updated successfully",
        customer: result.rows[0],
      });

    } catch (error: any) {
      console.error("Update customer error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update customer",
        error: error.message,
      });
    }
  }
);

// ===============================
// DELETE CUSTOMER
// ADMIN ONLY
// ===============================
router.delete(
  "/:id",
  authorizeRoles("ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `DELETE FROM customers
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      res.json({
        success: true,
        message: "Customer deleted successfully",
        customer: result.rows[0],
      });

    } catch (error: any) {
      console.error("Delete customer error:", error);

      res.status(500).json({
        success: false,
        message: "Failed to delete customer",
        error: error.message,
      });
    }
  }
);

export default router;