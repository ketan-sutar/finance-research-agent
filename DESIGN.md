# DESIGN.md

## Architecture

```text
User
  ↓
POST /ask
  ↓
Tara Agent
  ↓
Mastra Tools
  ↓
PostgreSQL
```

The agent receives a natural language question, determines which tool(s) are required, retrieves data from PostgreSQL, and generates a grounded response using tool results.

---

# Database Schema

## transactions

```sql
transactions (
  id TEXT PRIMARY KEY,
  transaction_date DATE,
  merchant TEXT,
  merchant_canonical TEXT,
  category TEXT,
  amount NUMERIC,
  currency TEXT,
  memo TEXT
)
```

Purpose:

* Store transaction history
* Support merchant, category, and date-based analysis

Indexes:

```sql
CREATE INDEX idx_txn_date
ON transactions(transaction_date);

CREATE INDEX idx_txn_category
ON transactions(category);

CREATE INDEX idx_txn_merchant
ON transactions(merchant_canonical);
```

---

## funds

```sql
funds (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT
)
```

Purpose:

* Store fund metadata

---

## fund_navs

```sql
fund_navs (
  fund_id TEXT,
  nav_date DATE,
  nav NUMERIC
)
```

Purpose:

* Store historical NAV values

Index:

```sql
CREATE INDEX idx_nav_fund_date
ON fund_navs(fund_id, nav_date);
```

---

## holdings

```sql
holdings (
  fund_id TEXT,
  fund_name TEXT,
  units NUMERIC,
  purchase_date DATE,
  purchase_nav NUMERIC
)
```

Purpose:

* Store user-owned investments

---

# Tool Design

The system uses a small set of expressive tools instead of many narrowly scoped tools.

Examples:

* queryTransactionsTool
* fundReturnTool
* portfolioValueTool
* realisedReturnTool
* recurringSubscriptionsTool

This reduces tool selection ambiguity and improves agent reliability.

---

# Grounding Strategy

All financial figures are generated from PostgreSQL queries.

The language model is never responsible for:

* arithmetic calculations
* rankings
* aggregations
* return calculations

These are performed using SQL and TypeScript logic.

---

# Merchant Matching

Merchant aliases are normalized during ingestion.

Examples:

```text
SWIGGY
SWIGGY*ORDER
Swiggy Instamart
SWIGGY BANGALORE
```

become:

```text
SWIGGY
```

This allows merchant-wide searches without hardcoded merchant lists.

---

# Refund Handling

Refunds are represented as negative transaction amounts.

Formula:

```text
Net Spend = SUM(amount)
```

Negative values automatically reduce spending totals.

---

# Transfer Handling

Transactions with category:

```text
transfer
```

are excluded from spending-related calculations unless explicitly requested.

---

# Fund Period Return

Formula:

Return % = ((End NAV - Start NAV) / Start NAV) × 100

Used for:

* fund performance
* fund ranking
* fund comparisons

---

# Holding Realised Return

Current Value:

```text
Units × Current NAV
```

Cost Basis:

```text
Units × Purchase NAV
```

Return %:

```text
((Current Value - Cost Basis)
 / Cost Basis) × 100
```

Used for:

* realised return
* portfolio gain/loss
* holding comparison

---

# Recurring Subscription Detection

A merchant is considered recurring when:

* multiple transactions exist
* transaction frequency appears periodic
* transaction amounts are similar

Recurring subscriptions are identified using transaction history patterns.

---

# Date Handling

Examples:

```text
March 2025
→ 2025-03-01 to 2025-03-31

April 2025
→ 2025-04-01 to 2025-04-30

Q1 2025
→ 2025-01-01 to 2025-03-31

Last Year
→ 2025-01-01 to 2025-12-31
```

Dates are converted into explicit ranges before tool execution.

---

# No Data Handling

When no matching records exist:

```text
No matching data found.
```

The agent never fabricates values.

---

# Evaluation Strategy

The project includes an automated evaluation suite that:

* sends questions to POST /ask
* validates expected responses
* reports pass/fail statistics

Coverage includes:

* spending lookups
* date filtering
* portfolio analysis
* fund returns
* recurring subscriptions
* no-data cases

---

# Observability

Each request logs:

* question
* tool calls
* tool inputs
* execution status
* latency
* errors

This makes failures reproducible and easier to debug.

---

# Future Improvements

* Async long-running jobs using BullMQ
* Improved merchant normalization
* Better recurring payment detection
* Caching for expensive fund calculations
* Advanced portfolio analytics
