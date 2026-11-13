import pool from "../../config/db.js";

// Fetch inventory list with stock status calculation
export const selectInventoryList = async () => {
  const query = `
    SELECT 
      p.id,
      p.name,
      p.sku,
      p.stock_quantity,
      p.low_stock_threshold,
      p.price,
      c.name AS category_name,
      CASE 
        WHEN p.stock_quantity = 0 THEN 'out_of_stock'
        WHEN p.stock_quantity <= p.low_stock_threshold THEN 'low_stock'
        ELSE 'in_stock'
      END AS status,
      p.updated_at
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.stock_quantity ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// Update stock quantity for a product
export const updateProductStock = async (productId, newQuantity) => {
  const [result] = await pool.execute(
    "UPDATE products SET stock_quantity = ? WHERE id = ?",
    [newQuantity, productId]
  );
  return result.affectedRows > 0;
};

// Summary metrics for inventory
export const selectInventorySummary = async () => {
  const query = `
    SELECT 
      COUNT(*) AS total_products,
      COALESCE(SUM(stock_quantity), 0) AS total_units,
      COALESCE(SUM(CASE WHEN stock_quantity <= low_stock_threshold AND stock_quantity > 0 THEN 1 ELSE 0 END), 0) AS low_stock_count,
      COALESCE(SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock_count,
      COALESCE(SUM(stock_quantity * price), 0) AS total_inventory_valuation
    FROM products
  `;
  const [rows] = await pool.execute(query);
  return rows[0];
};

