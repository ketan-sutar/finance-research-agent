import "dotenv/config";
import express from "express";
// import askRouter from "./api/ask";

import askRoutes from "./routes/ask.routes";

const app = express();
app.use(express.json());

app.use("/", askRoutes);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
