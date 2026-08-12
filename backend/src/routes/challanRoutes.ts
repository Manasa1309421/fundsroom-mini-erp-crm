import { Router } from "express";
import { pool } from "../config/database";

const router = Router();

/*
  GET /api/challans/test
  Test Challans API + database
*/
router.get("/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      message: "Challans API and database are working!",
      time: result.rows[0].now,
    });
  } catch (error: any) {
    console.error("Challan test error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

/*
  GET /api/challans
  Get all challans
*/
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by,
        created_at
      FROM challans
      ORDER BY id DESC
    `);

    res.json({
      success: true,
      challans: result.rows,
    });
  } catch (error: any) {
    console.error("Get challans error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get challans",
      error: error.message,
    });
  }
});

/*
  GET /api/challans/:id
  Get one challan
*/
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by,
        created_at
      FROM challans
      WHERE id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    res.json({
      success: true,
      challan: result.rows[0],
    });
  } catch (error: any) {
    console.error("Get challan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get challan",
      error: error.message,
    });
  }
});

/*
  POST /api/challans
  Create challan
*/
router.post("/", async (req, res) => {
  try {
    const {
      challan_number,
      customer_id,
      total_quantity,
      status,
      created_by,
    } = req.body;

    // Required field validation
    if (!challan_number || !customer_id) {
      return res.status(400).json({
        success: false,
        message: "challan_number and customer_id are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO challans
      (
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by,
        created_at
      `,
      [
        challan_number,
        customer_id,
        total_quantity ?? null,
        status ?? "Pending",
        created_by ?? null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Challan created successfully",
      challan: result.rows[0],
    });
  } catch (error: any) {
    console.error("Create challan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create challan",
      error: error.message,
    });
  }
});

/*
  PUT /api/challans/:id
  Update challan
*/
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      challan_number,
      customer_id,
      total_quantity,
      status,
      created_by,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE challans
      SET
        challan_number = $1,
        customer_id = $2,
        total_quantity = $3,
        status = $4,
        created_by = $5
      WHERE id = $6
      RETURNING
        id,
        challan_number,
        customer_id,
        total_quantity,
        status,
        created_by,
        created_at
      `,
      [
        challan_number,
        customer_id,
        total_quantity ?? null,
        status ?? "Pending",
        created_by ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    res.json({
      success: true,
      message: "Challan updated successfully",
      challan: result.rows[0],
    });
  } catch (error: any) {
    console.error("Update challan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update challan",
      error: error.message,
    });
  }
});

/*
  DELETE /api/challans/:id
  Delete challan
*/
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM challans
      WHERE id = $1
      RETURNING id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Challan not found",
      });
    }

    res.json({
      success: true,
      message: "Challan deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete challan error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete challan",
      error: error.message,
    });
  }
});

export default router;