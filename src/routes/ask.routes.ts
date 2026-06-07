import express from "express";

import { askQuestion } from "../controllers/ask.controller";

const router = express.Router();

router.post("/ask", askQuestion);

export default router;
