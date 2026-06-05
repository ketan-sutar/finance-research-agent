// import { pool } from "../db/db";

// export async function fundReturn(
//   fundName: string,
//   startDate: string,
//   endDate: string,
// ) {
//   const fund = await pool.query(
//     `
//     SELECT *
//     FROM funds
//     WHERE LOWER(name) LIKE LOWER($1)
//     LIMIT 1
//     `,
//     [`% ${fundName} %`],
//   );

//   if (!fund.rows.length) {
//     return { error: "Fund not found" };
//   }

//   const fundId = fund.rows[0].id;
//   const start = await pool.query(
//     ` 
//     SELECT nav
//     FROM fund_nav
//     WHERE fund_id=$1
//     AND date <= $2
//     ORDER BY date DESC
//     LIMIT 1
//     `,
//     [fundId, startDate],
//   );

//   const end = await pool.query(
//     `
//     SELECT nav
//     FROM fund_nav
//     WHERE fund_id=$1
//     AND date <=$2
//     ORDER BY date DESC
//     LIMIT 1
//     `,
//     [fundId, endDate],
//   );

//   const startNAV = Number(start.rows[0].nav);
//   const endNAV = Number(end.rows[0].nav);

//   const returnPercent = ((endNAV - startNAV) / startNAV) * 100;

//   return {
//     fundName,
//     startNAV,
//     endNAV,
//     returnPercent: Number(returnPercent.toFixed(2)),
//   };
// }
