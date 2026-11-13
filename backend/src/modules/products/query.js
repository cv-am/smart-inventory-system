import pool from "../../config/db.js";

// Fetch all products with category name and optional search/filter
export const selectAllProducts = async ({ search = "", categoryId = null } = {}) => {
  let query = `
    SELECT 
      p.id,
      p.name,
      p.sku,
      p.description,
      p.price,
      p.stock_quantity,
      p.low_stock_threshold,
      p.category_id,
      c.name AS category_name,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (search && search.trim()) {
    query += ` AND (p.name LIKE ? OR p.sku LIKE ?)`;
    const searchParam = `%${search.trim()}%`;
    params.push(searchParam, searchParam);
  }

  if (categoryId) {
    query += ` AND p.category_id = ?`;
    params.push(Number(categoryId));
  }

  query += ` ORDER BY p.id DESC`;

  const [rows] = await pool.execute(query, params);
  return rows;
};

// Fetch product by ID
export const selectProductById = async (id) => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.sku,
      p.description,
      p.price,
      p.stock_quantity,
      p.low_stock_threshold,
      p.category_id,
      c.name AS category_name,
      p.created_at,
      p.updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
};

// Fetch product by SKU
export const selectProductBySku = async (sku) => {
  const [rows] = await pool.execute(
    "SELECT * FROM products WHERE sku = ?",
    [sku]
  );
  return rows[0] || null;
};

// Insert a new product
export const insertProduct = async ({
  categoryId,
  name,
  sku,
  description = null,
  price,
  stockQuantity = 0,
  lowStockThreshold = 5,
}) => {
  const [result] = await pool.execute(
    `INSERT INTO products 
      (category_id, name, sku, description, price, stock_quantity, low_stock_threshold) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      categoryId,
      name,
      sku,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
    ]
  );
  return result.insertId;
};

// Update an existing product
export const updateProductQuery = async (id, {
  categoryId,
  name,
  sku,
  description = null,
  price,
  stockQuantity,
  lowStockThreshold,
}) => {
  const [result] = await pool.execute(
    `UPDATE products 
     SET category_id = ?, name = ?, sku = ?, description = ?, price = ?, stock_quantity = ?, low_stock_threshold = ? 
     WHERE id = ?`,
    [
      categoryId,
      name,
      sku,
      description,
      price,
      stockQuantity,
      lowStockThreshold,
      id,
    ]
  );
  return result.affectedRows > 0;
};

// Delete a product
export const deleteProductQuery = async (id) => {
  const [result] = await pool.execute(
    "DELETE FROM products WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
};

// Select low-stock products
export const selectLowStockProducts = async () => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.sku,
      p.price,
      p.stock_quantity,
      p.low_stock_threshold,
      p.category_id,
      c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.stock_quantity <= p.low_stock_threshold
    ORDER BY p.stock_quantity ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

