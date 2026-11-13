import pool from "../../config/db.js";

// Find user by email
export const findUserByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
};

// Find user by ID (excludes password hash for safety)
export const findUserById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, created_at FROM users WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// Create a new user record
export const createUser = async (name, email, passwordHash, role = "staff") => {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

// Fetch all users (admin management)
export const selectAllUsers = async () => {
  const [rows] = await pool.execute(
    "SELECT id, name, email, role, created_at FROM users ORDER BY id DESC"
  );
  return rows;
};

