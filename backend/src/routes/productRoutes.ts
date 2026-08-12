import { Router } from "express";
import { pool } from "../config/database";

const router = Router();

// =====================================================
// TEST PRODUCT DATABASE
// =====================================================

router.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Products database is working!",
      time: result.rows[0].now,
    });
  } catch (error: any) {
    console.error("Product DB test error:", error);

    res.status(500).json({
      success: false,
      message: "Product database connection failed",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE PRODUCT
// POST /api/products
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      name,
      sku,
      unit_price,
      current_stock,
      minimum_stock,
      location,
    } = req.body;

    console.log("PRODUCT BODY:", req.body);

    if (!name || !sku || unit_price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name, SKU and unit price are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO products
       (name, sku, unit_price, current_stock, minimum_stock, location)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        name,
        sku,
        unit_price,
        current_stock ?? 0,
        minimum_stock ?? 0,
        location ?? null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
      code: error.code || null,
      detail: error.detail || null,
    });
  }
});

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM products
       ORDER BY id DESC`
    );

    res.json({
      success: true,
      products: result.rows,
    });
  } catch (error: any) {
    console.error("Get products error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get products",
      error: error.message,
    });
  }
});

// =====================================================
// GET PRODUCT BY ID
// GET /api/products/:id
// =====================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get product",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      sku,
      unit_price,
      current_stock,
      minimum_stock,
      location,
    } = req.body;

    const result = await pool.query(
      `UPDATE products
       SET
         name = COALESCE($1, name),
         sku = COALESCE($2, sku),
         unit_price = COALESCE($3, unit_price),
         current_stock = COALESCE($4, current_stock),
         minimum_stock = COALESCE($5, minimum_stock),
         location = COALESCE($6, location)
       WHERE id = $7
       RETURNING *`,
      [
        name ?? null,
        sku ?? null,
        unit_price ?? null,
        current_stock ?? null,
        minimum_stock ?? null,
        location ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
});

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM products
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Delete product error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE STOCK
// PATCH /api/products/:id/stock
// =====================================================

router.patch("/:id/stock", async (req, res) => {
  try {
    const { id } = req.params;
    const { current_stock } = req.body;

    if (current_stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "current_stock is required",
      });
    }

    const result = await pool.query(
      `UPDATE products
       SET current_stock = $1
       WHERE id = $2
       RETURNING *`,
      [current_stock, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Stock updated successfully",
      product: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update stock",
      error: error.message,
    });
  }
});

// =====================================================
// LOW STOCK PRODUCTS
// GET /api/products/low-stock
// =====================================================

router.get("/inventory/low-stock", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM products
       WHERE current_stock <= minimum_stock
       ORDER BY current_stock ASC`
    );

    res.json({
      success: true,
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error: any) {
    console.error("Low stock error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get low stock products",
      error: error.message,
    });
  }
});

// =====================================================
// EXPORT
// =====================================================

export default router;