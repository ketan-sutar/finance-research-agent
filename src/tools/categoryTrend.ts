import { pool } from "../db/db";

export async function categoryTrend(
  categories: string[],
  startDate?: string,
  endDate?: string,
) {
  const placeholders = categories.map((_, i) => `LOWER($${i + 1})`).join(", ");

  let sql = `
    SELECT
      DATE_TRUNC('month', transaction_date) AS month,
      LOWER(category) AS category,
      ROUND(SUM(amount), 2) AS spend
    FROM transactions
    WHERE LOWER(category) IN (${placeholders})
      AND amount > 0
  `;

  const params: any[] = categories.map((c) => c.toLowerCase());

  if (startDate) {
    params.push(startDate);
    sql += ` AND transaction_date >= $${params.length}`;
  }
  if (endDate) {
    params.push(endDate);
    sql += ` AND transaction_date <= $${params.length}`;
  }

  sql += ` GROUP BY month, category ORDER BY month, category`;

  const result = await pool.query(sql, params);
  if (result.rows.length === 0) return { noData: true };
  return { trend: result.rows };
}
