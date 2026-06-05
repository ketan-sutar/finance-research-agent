import { pool } from "../db/db";

export async function portfolioAnalysis() {
  const holdingsRes = await pool.query(`
    SELECT h.*, f.name
    FROM holdings h
    JOIN funds f ON f.id = h.fund_id
  `);

  const holdings = holdingsRes.rows;

  let totalCost = 0;
  let portfolioValue = 0;

  for (const h of holdings) {
    const navRes = await pool.query(
      `
      SELECT nav
      FROM fund_navs
      WHERE fund_id = $1
      ORDER BY nav_date DESC
      LIMIT 1
      `,
      [h.fund_id],
    );

    if (navRes.rows.length === 0) continue;

    const latestNAV = Number(navRes.rows[0].nav);

    const units = Number(h.units);
    const purchaseNAV = Number(h.purchase_nav);

    const cost = units * purchaseNAV;
    const current = units * latestNAV;

    totalCost += cost;
    portfolioValue += current;
  }

  const profit = portfolioValue - totalCost;

  const returnPercent = totalCost === 0 ? 0 : (profit / totalCost) * 100;

  return {
    portfolioValue: Number(portfolioValue.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    returnPercent: Number(returnPercent.toFixed(2)),
  };
}
