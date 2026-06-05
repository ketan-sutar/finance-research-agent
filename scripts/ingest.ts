import fs from "fs";
import path from "path";

import { pool } from "../src/db/db";
import { canonicalMerchant } from "../src/utils/merchant";

const DATA_DIR = process.env.DATA_DIR;

if (!DATA_DIR) {
  console.error("DATA_DIR environment variable not set");
  process.exit(1);
}

const transactions = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "transactions.json"), "utf-8"),
);

const funds = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "funds.json"), "utf-8"),
);

const holdings = JSON.parse(
  fs.readFileSync(path.join(DATA_DIR, "holdings.json"), "utf-8"),
);
async function ingest() {
  try {
    console.log("Transactions:", transactions.length);
    console.log("Funds:", funds.length);
    console.log("Holdings:", holdings.length);

    for (const txn of transactions) {
      await pool.query(
        `
        INSERT INTO transactions(
          id,
          transaction_date,
          merchant,
          merchant_canonical,
          category,
          amount,
          currency,
          memo
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)
        ON CONFLICT(id) DO NOTHING
        `,
        [
          txn.id,
          txn.date,
          txn.merchant,
          canonicalMerchant(txn.merchant),
          txn.category,
          txn.amount,
          txn.currency,
          txn.memo,
        ],
      );
    }

    console.log("Transactions imported");

    for (const fund of funds) {
      await pool.query(
        `
        INSERT INTO funds(
          id,
          name,
          category
        )
        VALUES($1,$2,$3)
        ON CONFLICT(id) DO NOTHING
        `,
        [fund.id, fund.name, fund.category],
      );
    }

    console.log("Funds imported");

    for (const fund of funds) {
      for (const navPoint of fund.nav) {
        await pool.query(
          `
          INSERT INTO fund_navs(
            fund_id,
            nav_date,
            nav
          )
          VALUES($1,$2,$3)
          ON CONFLICT DO NOTHING
          `,
          [fund.id, navPoint.date, navPoint.value],
        );
      }
    }

    console.log("NAV history imported");

    
    for (const holding of holdings) {
      const fund = funds.find((f: any) => f.id === holding.fund_id);
      await pool.query(
        `INSERT INTO holdings(fund_id, fund_name, units, purchase_date, purchase_nav)
         VALUES($1,$2,$3,$4,$5)
         ON CONFLICT (fund_id, purchase_date) DO NOTHING`,
        [
          holding.fund_id,
          fund?.name ?? "",
          holding.units,
          holding.purchase_date,
          holding.purchase_nav,
        ],
      );
    }

    console.log("Holdings imported");

    const txnCount = await pool.query("SELECT COUNT(*) FROM transactions");

    console.log("Transactions in DB:", txnCount.rows[0].count);

    console.log("Data Imported Successfully");
  } catch (error) {
    console.error("Ingestion Error:", error);
  } finally {
    await pool.end();
  }
}

ingest();
