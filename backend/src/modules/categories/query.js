import pool from "../../config/db.js";

// Fetch all categories
export const selectAllCategories = async () => {
  const [rows] = await pool.execute(
    "SELECT * FROM categories ORDER BY id DESC"
  );
  return rows;
};

// Fetch category by ID
export const selectCategoryById = async (id) => {
  const [rows] = await pool.execute(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

// Insert new category
export const insertCategory = async (name, description) => {
  const [result] = await pool.execute(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description]
  );
  return result.insertId;
};

// Update existing category
export const updateCategoryQuery = async (id, name, description) => {
  const [result] = await pool.execute(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [name, description, id]
  );
  return result.affectedRows > 0;
};

// Delete category
export const deleteCategoryQuery = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM categories WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

