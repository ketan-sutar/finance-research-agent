import fetch from "node-fetch";

const tests = [
  "How much did I spend on food in March 2025?",
  "Top 5 merchants by spend Jan to Mar 2025?",
  "Did I spend more on food or travel?",
  "What is my portfolio worth today?",
  "Show recurring subscriptions",
  "What is my realised return?",
  "How much did I spend on food in January 2025?",
  "How much did I spend on food in February 2025?",
  "Top 3 merchants by spend Jan to Mar 2025?",
  "What is my portfolio value?",
  "Did I spend more on travel or food?",
  "Show recurring payments"
];

async function run() {
  let passed = 0;

  for (const q of tests) {
    const res = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: q }),
    });

    const data: any = await res.json();
    const answer = data.answer ?? "";

    const ok = answer.trim().length > 0;

    console.log(`\nQ: ${q}`);
    console.log(`A: ${answer}`);
    console.log(ok ? "✅ PASS" : "❌ FAIL");

    if (ok) passed++;
  }

  console.log("\n====================");
  console.log(`PASSED: ${passed}/${tests.length}`);
  console.log(`FAILED: ${tests.length - passed}`);
}

run();