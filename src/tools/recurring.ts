import { pool } from "../db/db";

function detectFrequency(dates: string[]) {
  if (dates.length < 2) return 0;

  const sorted = dates.map((d) => new Date(d).getTime()).sort((a, b) => a - b);

  const diffs = [];

  for (let i = 1; i < sorted.length; i++) {
    const diffDays = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
    diffs.push(diffDays);
  }

  const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;

  return avg;
}

export async function detectRecurringSubscriptions() {
  const res = await pool.query(`
    SELECT
      merchant_canonical,
      COUNT(*) as txn_count,
      ARRAY_AGG(transaction_date) as dates,
      ARRAY_AGG(amount) as amounts
    FROM transactions
    WHERE category != 'transfer'
    GROUP BY merchant_canonical
    HAVING COUNT(*) >= 3
  `);

  const results = [];

  for (const row of res.rows) {
    const freq = detectFrequency(row.dates);

    const isMonthly = freq >= 25 && freq <= 35;

    const amounts = row.amounts.map(Number);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;

    const variance =
      amounts.reduce((sum, a) => sum + Math.abs(a - avg), 0) / amounts.length;

    const confidence = isMonthly
      ? Math.max(0.6, 1 - variance / (avg || 1))
      : 0.3;

    if (confidence > 0.6) {
      results.push({
        merchant: row.merchant_canonical,
        confidence: Number(confidence.toFixed(2)),
      });
    }
  }

  return {
    recurringSubscriptions: results.sort((a, b) => b.confidence - a.confidence),
  };
}
