import { pool } from "../db/db";

type FundReturnInput = {
  fundName: string;
  startDate: string;
  endDate: string;
};

export async function fundReturn(input: FundReturnInput) {
  const { fundName, startDate, endDate } = input;

  // 1. Find fund
  const fundRes = await pool.query(
    `
    SELECT id, name
    FROM funds
    WHERE LOWER(name) LIKE LOWER($1)
    LIMIT 1
    `,
    [`%${fundName}%`],
  );

  if (!fundRes.rows.length) return { error: `No fund found for ${fundName}` };

  const fund = fundRes.rows[0];

  // 2. Get NAV at start date (closest previous NAV)
  const startNavRes = await pool.query(
    `
    SELECT nav
    FROM fund_navs
    WHERE fund_id = $1 AND nav_date <= $2
    ORDER BY nav_date DESC
    LIMIT 1
    `,
    [fund.id, startDate],
  );

  // 3. Get NAV at end date (closest previous NAV)
  const endNavRes = await pool.query(
    `
    SELECT nav
    FROM fund_navs
    WHERE fund_id = $1 AND nav_date <= $2
    ORDER BY nav_date DESC
    LIMIT 1
    `,
    [fund.id, endDate],
  );

  if (startNavRes.rows.length === 0 || endNavRes.rows.length === 0) {
    return {
      error: "NAV data missing for given range",
    };
  }

  const startNAV = Number(startNavRes.rows[0].nav);
  const endNAV = Number(endNavRes.rows[0].nav);

  // 4. Return calculation
  const returnPercent = ((endNAV - startNAV) / startNAV) * 100;

  return {
    fundName: fund.name,
    startNAV,
    endNAV,
    returnPercent: Number(returnPercent.toFixed(2)),
  };
}

export async function rankFundsByReturn(startDate: string, endDate: string) {
  const funds = await pool.query(`SELECT id, name FROM funds`);
  const results = [];

  for (const fund of funds.rows) {
    const s = await pool.query(
      `SELECT nav FROM fund_navs WHERE fund_id=$1 AND nav_date <= $2
       ORDER BY nav_date DESC LIMIT 1`,
      [fund.id, startDate],
    );
    const e = await pool.query(
      `SELECT nav FROM fund_navs WHERE fund_id=$1 AND nav_date <= $2
       ORDER BY nav_date DESC LIMIT 1`,
      [fund.id, endDate],
    );
    if (!s.rows.length || !e.rows.length) continue;

    const startNAV = Number(s.rows[0].nav);
    const endNAV = Number(e.rows[0].nav);
    const returnPercent = ((endNAV - startNAV) / startNAV) * 100;
    results.push({
      fundName: fund.name,
      returnPercent: Number(returnPercent.toFixed(2)),
    });
  }

  if (results.length === 0) return { noData: true };
  const sorted = results.sort((a, b) => b.returnPercent - a.returnPercent);
  return { funds: sorted, best: sorted[0], worst: sorted[sorted.length - 1] };
}
