import pool from "../../config/db.js";

// Overall KPI statistics
export const selectDashboardStats = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM products) AS total_products,
      (SELECT COUNT(*) FROM categories) AS total_categories,
      (SELECT COUNT(*) FROM customers) AS total_customers,
      (SELECT COUNT(*) FROM bills) AS total_orders,
      (SELECT COALESCE(SUM(total_amount), 0) FROM bills) AS total_revenue,
      (SELECT COALESCE(SUM(total_amount), 0) FROM bills WHERE DATE(created_at) = CURDATE()) AS today_revenue,
      (SELECT COUNT(*) FROM bills WHERE DATE(created_at) = CURDATE()) AS today_orders,
      (SELECT COALESCE(SUM(stock_quantity), 0) FROM products) AS total_stock_units,
      (SELECT COUNT(*) FROM products WHERE stock_quantity <= low_stock_threshold) AS low_stock_count
  `;
  const [rows] = await pool.execute(query);
  return rows[0];
};

// Recent 5 transactions
export const selectRecentSales = async (limit = 5) => {
  const query = `
    SELECT 
      b.id,
      b.invoice_number,
      COALESCE(c.name, 'Walk-in Customer') AS customer_name,
      b.total_amount,
      b.payment_method,
      b.created_at
    FROM bills b
    LEFT JOIN customers c ON b.customer_id = c.id
    ORDER BY b.id DESC
    LIMIT ?
  `;
  const [rows] = await pool.execute(query, [String(limit)]);
  return rows;
};

// Sales performance chart data (daily revenue for past 7 days)
export const selectSalesChartData = async () => {
  const query = `
    SELECT 
      DATE(created_at) AS sale_date,
      DATE_FORMAT(created_at, '%b %d') AS display_date,
      COUNT(id) AS order_count,
      COALESCE(SUM(total_amount), 0) AS total_sales
    FROM bills
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(created_at), DATE_FORMAT(created_at, '%b %d')
    ORDER BY sale_date ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

