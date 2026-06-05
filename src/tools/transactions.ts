import { pool } from "../db/db";

interface QueryInput {
  category?: string;
  merchant?: string;
  startDate?: string;
  endDate?: string;
  excludeTransfers?: boolean;
}

export async function queryTransactions(input: QueryInput) {
  let sql = `
    SELECT * 
    FROM transactions
    WHERE 1=1
  `;

  const params: any[] = [];

  if (input.excludeTransfers !== false) {
    sql += ` AND LOWER(category) <> 'transfer'`;
  }

  if (input.category) {
    params.push(input.category);
    sql += ` AND LOWER(category)=LOWER($${params.length})`;
  }

  if (input.merchant) {
    params.push(`%${input.merchant}%`);
    sql += ` AND merchant_canonical ILIKE $${params.length}`;
  }

  if (input.startDate) {
    params.push(input.startDate);
    sql += ` AND transaction_date >= $${params.length}`;
  }

  if (input.endDate) {
    params.push(input.endDate);
    sql += ` AND transaction_date <= $${params.length}`;
  }

  const result = await pool.query(sql, params);
  if (result.rows.length === 0) {
    return {
      noData: true,
    };
  }

  return {
    count: result.rows.length,
    transactions: result.rows,
  };
}

//
// 2. AGGREGATE SPEND (CRITICAL FIX)
// - excludes transfers
// - handles refunds correctly using ABS()
// - ensures deterministic spend values
//
export async function aggregateSpend(
  category: string,
  startDate: string,
  endDate: string,
) {
  const result = await pool.query(
    `
    SELECT
      ROUND(
        COALESCE(SUM(amount),0),
        2
      ) AS total
    FROM transactions
    WHERE LOWER(category)=LOWER($1)
      AND transaction_date BETWEEN $2 AND $3
      AND LOWER(category) <> 'transfer'
    `,
    [category, startDate, endDate],
  );

  // Step 9: No Data Handling
  if (result.rows.length === 0 || result.rows[0].total === null) {
    return {
      noData: true,
      category,
      startDate,
      endDate,
    };
  }

  return {
    category,
    total: Number(result.rows[0].total),
    startDate,
    endDate,
  };
}
//
// 3. TOP MERCHANTS (FIXED TYPE + SAFETY)
// - ensures numeric conversion
// - stable ranking
//
export async function topMerchants(
  startDate: string,
  endDate: string,
  limit: number = 5,
) {
  const result = await pool.query(
    `
    SELECT
      merchant_canonical,
      ROUND(SUM(amount), 2) AS spend
    FROM transactions
    WHERE transaction_date BETWEEN $1 AND $2
      AND LOWER(category) <> 'transfer'
    GROUP BY merchant_canonical
    ORDER BY spend DESC
    LIMIT $3
    `,
    [startDate, endDate, limit],
  );
  if (result.rows.length === 0) {
    return {
      noData: true,
    };
  }

  return {
    merchants: result.rows,
  };
}

export async function totalSpend(startDate: string, endDate: string) {
  const result = await pool.query(
    `SELECT ROUND(COALESCE(SUM(amount), 0), 2) AS total
     FROM transactions
     WHERE transaction_date BETWEEN $1 AND $2
       AND LOWER(category) <> 'transfer'
       AND amount > 0`,
    [startDate, endDate],
  );
  return {
    total: Number(result.rows[0]?.total ?? 0),
    startDate,
    endDate,
  };
}

export async function biggestCategory(startDate: string, endDate: string) {
  const result = await pool.query(
    `SELECT category, ROUND(SUM(amount), 2) AS total
     FROM transactions
     WHERE transaction_date BETWEEN $1 AND $2
       AND LOWER(category) <> 'transfer'
       AND amount > 0
     GROUP BY category
     ORDER BY total DESC
     LIMIT 1`,
    [startDate, endDate],
  );
  if (result.rows.length === 0) return { noData: true };
  return {
    category: result.rows[0].category,
    total: Number(result.rows[0].total),
  };
}


export async function merchantSpend(
  merchant: string,
  startDate?: string,
  endDate?: string
) {
  const params = [`%${merchant}%`];

  let sql = `
    SELECT ROUND(COALESCE(SUM(amount),0),2) AS total
    FROM transactions
    WHERE merchant_canonical ILIKE $1
      AND LOWER(category) <> 'transfer'
  `;

  if (startDate) {
    params.push(startDate);
    sql += ` AND transaction_date >= $${params.length}`;
  }

  if (endDate) {
    params.push(endDate);
    sql += ` AND transaction_date <= $${params.length}`;
  }

  const result = await pool.query(sql, params);

  return {
    merchant,
    total: Number(result.rows[0].total),
  };
}