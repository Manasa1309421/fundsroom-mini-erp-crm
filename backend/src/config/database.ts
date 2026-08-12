import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on("connect", () => {
  console.log("✅ Connected to Supabase PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Database error:", err);
});

// Test database connection
pool.query("SELECT NOW()")
  .then(() => {
    console.log("✅ Supabase database connected");
  })
  .catch((err) => {
    console.error("❌ Supabase connection failed:", err);
  });