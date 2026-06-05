import { pool } from "../src/db/db";

async function setup() {
  try {
    // Transactions Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        transaction_date DATE,
        merchant TEXT,
        merchant_canonical TEXT,
        category TEXT,
        amount NUMERIC(12,2),
        currency TEXT,
        memo TEXT
      );
    `);

    // Funds Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS funds (
        id TEXT PRIMARY KEY,
        name TEXT,
        category TEXT
      );
    `);

    // Fund NAVs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fund_navs (
        fund_id TEXT REFERENCES funds(id),
        nav_date DATE,
        nav NUMERIC(12,2),
        PRIMARY KEY (fund_id, nav_date)
      );
    `);

    // Holdings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS holdings (
        fund_id TEXT REFERENCES funds(id),
        fund_name TEXT,
        units NUMERIC(12,4),
        purchase_date DATE,
        purchase_nav NUMERIC(12,2),
        UNIQUE(fund_id, purchase_date)
      );
    `);

    // ==========================
    // Indexes for faster queries
    // ==========================

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_txn_date
      ON transactions(transaction_date);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_txn_category
      ON transactions(category);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_txn_merchant
      ON transactions(merchant_canonical);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_nav_fund
      ON fund_navs(fund_id);
    `);

   
    console.log("Tables and indexes created successfully");
  } catch (error) {
    console.error("Setup failed:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

setup();