import { aggregateSpend, topMerchants } from "../src/tools/transactions";

async function run() {
  const foodSpend = await aggregateSpend(
    "food",
    "2025-03-01",
    "2025-03-31"
  );

  console.log("FOOD SPEND:", foodSpend);

  const merchants = await topMerchants(
    "2025-01-01",
    "2025-03-31",
    5
  );

  console.log("TOP MERCHANTS:", merchants);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });



import { queryTransactions } from "../../ai-agent/src/tools/transactions";

async function test() {
  const result = await queryTransactions({
    merchant: "swiggy",
  });

  console.log(JSON.stringify(result, null, 2));
}

test();