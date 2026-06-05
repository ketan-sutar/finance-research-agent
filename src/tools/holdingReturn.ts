import { pool } from "../db/db";

export async function holdingReturn(fundName: string) {
  const holding = await pool.query(
    `SELECT h.*, f.name as fund_name
     FROM holdings h
     JOIN funds f ON f.id = h.fund_id
     WHERE LOWER(f.name) LIKE LOWER($1)
     LIMIT 1`,
    [`%${fundName}%`],
  );

  if (!holding.rows.length) return { error: "Holding not found" };

  const h = holding.rows[0];

  const latestNav = await pool.query(
    `SELECT nav FROM fund_navs
     WHERE fund_id = $1
     ORDER BY nav_date DESC LIMIT 1`,
    [h.fund_id],
  );

  if (!latestNav.rows.length) return { error: "NAV data not found" };

  const nav = Number(latestNav.rows[0].nav);
  const units = Number(h.units);
  const purchaseNav = Number(h.purchase_nav);
  const costBasis = units * purchaseNav;
  const currentValue = units * nav;
  const profit = currentValue - costBasis;
  const returnPercent = (profit / costBasis) * 100;

  return {
    fundName: h.fund_name,
    units,
    purchaseNav,
    currentNav: nav,
    costBasis: Number(costBasis.toFixed(2)),
    currentValue: Number(currentValue.toFixed(2)),
    profit: Number(profit.toFixed(2)),
    returnPercent: Number(returnPercent.toFixed(2)),
  };
}

export async function rankAllHoldings() {
  const holdings = await pool.query(
    `SELECT h.*, f.name as fund_name
     FROM holdings h JOIN funds f ON f.id = h.fund_id`,
  );

  const results = [];
  for (const h of holdings.rows) {
    const navRes = await pool.query(
      `SELECT nav FROM fund_navs WHERE fund_id=$1 ORDER BY nav_date DESC LIMIT 1`,
      [h.fund_id],
    );
    if (!navRes.rows.length) continue;

    const nav = Number(navRes.rows[0].nav);
    const units = Number(h.units);
    const purchaseNav = Number(h.purchase_nav);
    const costBasis = units * purchaseNav;
    const currentValue = units * nav;
    const profit = currentValue - costBasis;
    const returnPercent = (profit / costBasis) * 100;

    results.push({
      fundName: h.fund_name,
      returnPercent: Number(returnPercent.toFixed(2)),
      profit: Number(profit.toFixed(2)),
    });
  }

  return {
    holdings: results.sort((a, b) => b.returnPercent - a.returnPercent),
  };
}
