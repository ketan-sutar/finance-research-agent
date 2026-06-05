import "dotenv/config"
import express from "express";
import askRouter from "./api/ask";

const app = express();
app.use(express.json());

app.use("/", askRouter);

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
