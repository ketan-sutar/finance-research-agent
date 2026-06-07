# Finance Research Agent (Tara)

## Overview

Tara is a finance-research agent built using Mastra, PostgreSQL, and OpenAI. It answers natural language questions about personal finance data, including spending analysis, merchant insights, fund performance, portfolio valuation, and holding returns.

The agent uses tool calling to retrieve and compute real values from PostgreSQL and never generates financial figures without database-backed evidence.

---

## Features

* Transaction search and filtering
* Category-wise spending analysis
* Merchant spend analysis
* Fund period return calculations
* Portfolio valuation
* Holding realised return calculations
* Recurring subscription detection
* Transfer exclusion from spending calculations
* Refund-aware spending calculations
* No-data handling
* Evaluation suite with automated tests

---

## Technology Stack

* TypeScript
* Mastra SDK
* PostgreSQL
* OpenAI
* Express

---

## Project Structure

```text
src/
├── agent/
├── tools/
├── db/
├── routes/
├── eval/

scripts/
├── ingest.ts

data/
├── sample_a/
├── sample_b/
└── sample_c/
```

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/provue_tara
OPENAI_API_KEY=your_key
```

---

## Database Setup

Create the database:

```bash
createdb provue_tara
```

Run ingest:

```bash
DATA_DIR=./data/sample_a
npx tsx scripts/ingest.ts
```

---

## Running the Application

```bash
npm run dev
```

Server starts on:

```text
http://localhost:3000
```

---

## API

### POST /ask

Request:

```json
{
  "question": "How much did I spend on food in March 2025?"
}
```

Response:

```json
{
  "answer": "You spent ₹4,075.17 on food in March 2025."
}
```

---

## Evaluation

Run:

```bash
npx tsx src/eval/eval.ts
```

The evaluation suite covers:

* Single lookup
* Date filtering
* Merchant queries
* Spending analysis
* Fund returns
* Holding returns
* Recurring subscriptions
* Portfolio valuation
* No-data handling

---

## Deployment

Public URL:

```text
<ADD_DEPLOYMENT_URL_HERE>
```

---

## Known Limitations

* Relative date interpretation uses predefined rules.
* Merchant normalization is rule-based.
* Async background job execution is not implemented.
* Answers depend on available data in the database.

---

## Author

Ketan Sutar
