import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/database";

const router = Router();

/*
  POST /api/auth/login
  User login with JWT
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        email,
        password,
        role,
        created_at
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    /*
      Password verification

      This supports the existing users whose password may
      currently be stored as plain text, and also supports
      bcrypt passwords.
    */
    let passwordValid = false;

    if (user.password.startsWith("$2")) {
      passwordValid = await bcrypt.compare(
        password,
        user.password
      );
    } else {
      passwordValid = password === user.password;

      // Automatically convert old plain-text password to bcrypt
      if (passwordValid) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
          `
          UPDATE users
          SET password = $1
          WHERE id = $2
          `,
          [hashedPassword, user.id]
        );
      }
    }

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check JWT secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured",
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    // Login success
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

export default router;