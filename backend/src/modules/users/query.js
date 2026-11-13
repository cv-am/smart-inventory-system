import pool from "../../config/db.js";

// Fetch all users
export const selectAllUsers = async () => {
  const query = `
    SELECT id, name, email, role, created_at 
    FROM users 
    ORDER BY id DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// Fetch user by ID
export const selectUserById = async (id) => {
  const query = `
    SELECT id, name, email, role, created_at 
    FROM users 
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

// Update user role
export const updateUserRoleQuery = async (id, role) => {
  const [result] = await pool.execute(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, id]
  );
  return result.affectedRows > 0;
};

// Delete user
export const deleteUserQuery = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM users WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

