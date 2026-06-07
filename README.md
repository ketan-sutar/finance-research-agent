# 💰 Finance Research Agent (Tara)

A finance research agent that answers natural language questions about transactions, investments, funds, and portfolio performance using real data stored in PostgreSQL.

Built as part of the **Provue Engineering Take-Home Assignment**.

---

## 🚀 Features

### Transaction Analytics

* Search and filter transactions
* Merchant-level spending analysis
* Category-wise spending breakdown
* Date-range filtering
* Refund-aware calculations
* Transfer exclusion from spending metrics

### Investment Analytics

* Fund return calculations
* Portfolio valuation
* Holding realized return calculations
* Investment performance tracking

### Smart Insights

* Recurring subscription detection
* Natural language question answering
* Database-backed responses only
* Graceful no-data handling

### Evaluation Suite

* Automated test scenarios
* Accuracy validation
* Tool-level verification

---

## 🏗️ Tech Stack

| Technology | Purpose                    |
| ---------- | -------------------------- |
| TypeScript | Application development    |
| Mastra SDK | Agent framework            |
| PostgreSQL | Data storage               |
| OpenAI     | Tool-calling and reasoning |
| Express.js | API server                 |

---

## 📁 Project Structure

```text
finance-research-agent/
│
├── src/
│   ├── agent/
│   │   └── tara.ts
│   │
│   ├── tools/
│   │   ├── spending.ts
│   │   ├── merchant.ts
│   │   ├── funds.ts
│   │   ├── holdings.ts
│   │   └── portfolio.ts
│   │
│   ├── db/
│   │   └── db.ts
│   │
│   ├── routes/
│   │   └── ask.ts
│   │
│   ├── eval/
│   │   └── eval.ts
│   │
│   └── server.ts
│
├── scripts/
│   └── ingest.ts
│
├── data/
│   ├── sample_a/
│   ├── sample_b/
│   └── sample_c/
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/finance-research-agent.git

cd finance-research-agent
```

### 2. Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/provue_tara

OPENAI_API_KEY=your_openai_api_key
```

---

## 🗄️ Database Setup

### Create PostgreSQL Database

```bash
createdb provue_tara
```

### Import Sample Data

Sample datasets are provided inside the `data` directory.

```bash
DATA_DIR=./data/sample_a

npx tsx scripts/ingest.ts
```

You can replace `sample_a` with:

```text
sample_a
sample_b
sample_c
```

depending on the dataset you want to load.

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

Server will run at:

```text
http://localhost:3000
```

---

## 🔌 API Usage

### Endpoint

```http
POST /ask
```

### Request

```json
{
  "question": "How much did I spend on food in March 2025?"
}
```

### Response

```json
{
  "answer": "You spent ₹4,075.17 on food in March 2025."
}
```

---

## 💬 Example Questions

### Spending Analysis

```text
How much did I spend on food in March 2025?

What were my top spending categories last month?

How much did I spend at Starbucks this year?
```

### Investment Analysis

```text
What is my portfolio value?

How much has my SBI Bluechip Fund grown?

What is my realized return from Infosys shares?
```

### Subscription Detection

```text
Do I have any recurring subscriptions?

Which subscriptions cost me the most?
```

---

## 🧪 Evaluation

Run the evaluation suite:

```bash
npx tsx src/eval/eval.ts
```

### Covered Scenarios

* Transaction lookup
* Date filtering
* Merchant queries
* Spending calculations
* Fund returns
* Holding returns
* Portfolio valuation
* Recurring subscriptions
* No-data handling

---

## 🌐 Deployment

### Live API

```text
https://finance-research-agent-production-b0af.up.railway.app/ask
```

### Example Request

```bash
curl -X POST \
https://finance-research-agent-production-b0af.up.railway.app/ask \
-H "Content-Type: application/json" \
-d '{"question":"What is my portfolio value?"}'
```

---

## 🔄 System Workflow

```text
User Question
      │
      ▼
   Express API
      │
      ▼
  Tara Agent (Mastra)
      │
      ▼
 Tool Selection
      │
      ▼
 PostgreSQL Queries
      │
      ▼
 Computation Layer
      │
      ▼
 Final Answer
```

---

## ⚠️ Known Limitations

* Relative date parsing uses predefined rules.
* Merchant normalization is rule-based.
* No background job processing.
* Answers are limited to the data available in the database.
* Portfolio calculations assume valid NAV and holding data.

---

## 🔮 Future Improvements

* Semantic merchant matching
* Multi-user support
* Authentication and authorization
* Streaming responses
* Advanced financial analytics
* Historical portfolio performance charts
* Caching layer for faster queries

---
## 🏗️ System Architecture

![System Architecture](./docs/architecture.png)
The diagram illustrates the complete request lifecycle from user query → API → Tara Agent → Tools → PostgreSQL → grounded response.

---

## 👨‍💻 Author

**Ketan Sutar**

Built for the Provue Engineering Assignment.
